import os
import atexit
from typing import List, Dict, Any, Optional
from pymilvus import MilvusClient, DataType
from backend.config import MILVUS_URI, MILVUS_TOKEN, MILVUS_DB_PATH, MILVUS_DATA_DIR, EMBEDDING_DIM
from backend.services.embedding_service import create_embedding
from backend.models.schemas import Creator, CandidateProfile

class MilvusService:
    def __init__(self):
        self.client: Optional[MilvusClient] = None
        self.server_instance = None
        self.creators_collection = "creator_trajectories"
        self.candidates_collection = "candidate_profiles"
        self._is_initialized = False

    def connect(self):
        if self.client is not None:
            return self.client

        if MILVUS_URI:
            print(f"[Milvus] Connecting to external Milvus at {MILVUS_URI}...")
            self.client = MilvusClient(uri=MILVUS_URI, token=MILVUS_TOKEN or None)
        else:
            print(f"[Milvus] Initializing Milvus Lite embedded instance...")
            MILVUS_DATA_DIR.mkdir(parents=True, exist_ok=True)
            db_file_str = str(MILVUS_DB_PATH.resolve())
            
            try:
                import milvus_lite.server
                self.server_instance = milvus_lite.server.Server(db_file=db_file_str)
                self.server_instance.start()
                self.client = MilvusClient(uri=self.server_instance.uds_path)
                atexit.register(self.shutdown)
                print(f"[Milvus] Connected via Milvus Lite server ({self.server_instance.uds_path})")
            except Exception as e:
                print(f"[Milvus] Fallback connecting direct to uri {db_file_str}: {e}")
                self.client = MilvusClient(uri=db_file_str)

        self._setup_collections()
        self._is_initialized = True
        return self.client

    def shutdown(self):
        if self.server_instance:
            try:
                print("[Milvus] Stopping Milvus Lite server...")
                self.server_instance.stop()
            except Exception:
                pass
            self.server_instance = None

    def _setup_collections(self):
        if not self.client:
            return

        # 1. Creator Trajectories Collection
        if not self.client.has_collection(self.creators_collection):
            print(f"[Milvus] Creating collection: {self.creators_collection}")
            schema = self.client.create_schema(
                auto_id=True,
                enable_dynamic_field=True
            )
            schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True)
            schema.add_field(field_name="creator_id", datatype=DataType.VARCHAR, max_length=128)
            schema.add_field(field_name="domain", datatype=DataType.VARCHAR, max_length=64)
            schema.add_field(field_name="vector_past", datatype=DataType.FLOAT_VECTOR, dim=EMBEDDING_DIM)
            schema.add_field(field_name="vector_current", datatype=DataType.FLOAT_VECTOR, dim=EMBEDDING_DIM)

            index_params = self.client.prepare_index_params()
            index_params.add_index(
                field_name="vector_past",
                metric_type="COSINE",
                index_type="AUTOINDEX"
            )
            index_params.add_index(
                field_name="vector_current",
                metric_type="COSINE",
                index_type="AUTOINDEX"
            )

            self.client.create_collection(
                collection_name=self.creators_collection,
                schema=schema,
                index_params=index_params
            )

        # 2. Candidate Profiles Collection
        if not self.client.has_collection(self.candidates_collection):
            print(f"[Milvus] Creating collection: {self.candidates_collection}")
            schema_cand = self.client.create_schema(
                auto_id=True,
                enable_dynamic_field=True
            )
            schema_cand.add_field(field_name="id", datatype=DataType.INT64, is_primary=True)
            schema_cand.add_field(field_name="candidate_id", datatype=DataType.VARCHAR, max_length=128)
            schema_cand.add_field(field_name="domain", datatype=DataType.VARCHAR, max_length=64)
            schema_cand.add_field(field_name="vector", datatype=DataType.FLOAT_VECTOR, dim=EMBEDDING_DIM)

            index_params_cand = self.client.prepare_index_params()
            index_params_cand.add_index(
                field_name="vector",
                metric_type="COSINE",
                index_type="AUTOINDEX"
            )

            self.client.create_collection(
                collection_name=self.candidates_collection,
                schema=schema_cand,
                index_params=index_params_cand
            )

    def sync_creators(self, creators: List[Creator]):
        self.connect()
        if not self.client:
            return

        # Clear and reload creator embeddings
        try:
            if self.client.has_collection(self.creators_collection):
                self.client.drop_collection(self.creators_collection)
                self._setup_collections()
        except Exception as e:
            print(f"[Milvus] Reset collection warning: {e}")

        entities = []
        for creator in creators:
            past_text = f"{creator.trajectory.role3YearsAgo} {creator.trajectory.company3YearsAgo} {' '.join(creator.trajectory.keyJumpSkills)}"
            current_text = f"{creator.role} {creator.company} {' '.join(creator.skills)}"

            past_vec = create_embedding(past_text)
            current_vec = create_embedding(current_text)

            entities.append({
                "creator_id": creator.id,
                "domain": creator.domain,
                "name": creator.name,
                "role": creator.role,
                "company": creator.company,
                "role3YearsAgo": creator.trajectory.role3YearsAgo,
                "company3YearsAgo": creator.trajectory.company3YearsAgo,
                "vector_past": past_vec,
                "vector_current": current_vec
            })

        if entities:
            self.client.insert(collection_name=self.creators_collection, data=entities)
            print(f"[Milvus] Successfully indexed {len(entities)} creators in {self.creators_collection}!")

    def upsert_creator(self, creator: Creator):
        self.connect()
        if not self.client:
            return
        
        # Delete old if exists
        try:
            self.client.delete(
                collection_name=self.creators_collection,
                filter=f'creator_id == "{creator.id}"'
            )
        except Exception:
            pass

        past_text = f"{creator.trajectory.role3YearsAgo} {creator.trajectory.company3YearsAgo} {' '.join(creator.trajectory.keyJumpSkills)}"
        current_text = f"{creator.role} {creator.company} {' '.join(creator.skills)}"

        self.client.insert(
            collection_name=self.creators_collection,
            data=[{
                "creator_id": creator.id,
                "domain": creator.domain,
                "name": creator.name,
                "role": creator.role,
                "company": creator.company,
                "role3YearsAgo": creator.trajectory.role3YearsAgo,
                "company3YearsAgo": creator.trajectory.company3YearsAgo,
                "vector_past": create_embedding(past_text),
                "vector_current": create_embedding(current_text)
            }]
        )

    def search_trajectory_vectors(
        self,
        candidate_baseline_vector: List[float],
        candidate_target_vector: List[float],
        domain: Optional[str] = None,
        limit: int = 25
    ) -> Dict[str, Dict[str, float]]:
        """
        Queries Milvus for vector similarities:
        Returns a dict mapping creator_id -> {'origin_sim': float, 'dest_sim': float}
        """
        self.connect()
        if not self.client or not self.client.has_collection(self.creators_collection):
            return {}

        filter_expr = f'domain == "{domain}"' if domain else None

        results_map: Dict[str, Dict[str, float]] = {}

        try:
            # 1. Search origin similarity (Candidate Baseline vs Creator Past Trajectory)
            past_res = self.client.search(
                collection_name=self.creators_collection,
                data=[candidate_baseline_vector],
                anns_field="vector_past",
                filter=filter_expr,
                limit=limit,
                output_fields=["creator_id", "domain"]
            )
            for hit_list in past_res:
                for hit in hit_list:
                    cid = hit.get("entity", {}).get("creator_id")
                    if cid:
                        dist = max(0.0, float(hit.get("distance", 0.0)))
                        results_map.setdefault(cid, {})["origin_sim"] = dist

            # 2. Search destination similarity (Candidate Target vs Creator Current Role)
            dest_res = self.client.search(
                collection_name=self.creators_collection,
                data=[candidate_target_vector],
                anns_field="vector_current",
                filter=filter_expr,
                limit=limit,
                output_fields=["creator_id", "domain"]
            )
            for hit_list in dest_res:
                for hit in hit_list:
                    cid = hit.get("entity", {}).get("creator_id")
                    if cid:
                        dist = max(0.0, float(hit.get("distance", 0.0)))
                        results_map.setdefault(cid, {})["dest_sim"] = dist

        except Exception as e:
            print(f"[Milvus] Search trajectory vector warning: {e}")

        return results_map

    def sync_candidates(self, candidates: List[CandidateProfile]):
        self.connect()
        if not self.client:
            return

        try:
            if self.client.has_collection(self.candidates_collection):
                self.client.drop_collection(self.candidates_collection)
                self._setup_collections()
        except Exception as e:
            print(f"[Milvus] Reset candidates warning: {e}")

        entities = []
        for cand in candidates:
            cand_text = f"{cand.headline} {cand.summary} {' '.join(cand.skills)}"
            entities.append({
                "candidate_id": cand.id,
                "domain": cand.domain or "Full-Stack",
                "vector": create_embedding(cand_text)
            })

        if entities:
            self.client.insert(collection_name=self.candidates_collection, data=entities)
            print(f"[Milvus] Indexed {len(entities)} candidate vectors!")

    def search_candidates_neural(self, query_vector: List[float], domain: Optional[str] = None, limit: int = 20) -> List[Dict[str, Any]]:
        self.connect()
        if not self.client or not self.client.has_collection(self.candidates_collection):
            return []

        filter_expr = f'domain == "{domain}"' if domain else None
        try:
            res = self.client.search(
                collection_name=self.candidates_collection,
                data=[query_vector],
                anns_field="vector",
                filter=filter_expr,
                limit=limit,
                output_fields=["candidate_id", "domain"]
            )
            matches = []
            for hit_list in res:
                for hit in hit_list:
                    matches.append({
                        "candidate_id": hit.get("entity", {}).get("candidate_id"),
                        "similarity": max(0.0, float(hit.get("distance", 0.0)))
                    })
            return matches
        except Exception as e:
            print(f"[Milvus] Candidate neural search error: {e}")
            return []

milvus_service = MilvusService()
