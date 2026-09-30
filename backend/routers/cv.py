from fastapi import APIRouter, HTTPException
from backend.models.schemas import CvParseInput, GapAnalysisInput, PathwaysAnalysisInput
from backend.services.cv_service import cv_service

router = APIRouter(prefix="/api/cv", tags=["CV"])

@router.post("/parse")
def parse_cv(payload: CvParseInput):
    try:
        data = cv_service.parse_cv(payload.cvText, payload.metadata)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/gap-analysis")
def gap_analysis(payload: GapAnalysisInput):
    try:
        data = cv_service.perform_gap_analysis(
            domain_key=payload.domain or 'full-stack',
            candidate_skills=payload.skills or [],
            candidate_role=payload.currentRole or 'Senior Frontend Engineer',
            current_ctc=payload.currentCtc or '₹7.5 LPA',
            current_company=payload.currentCompany,
            target_company=payload.targetCompany
        )
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/pathways-analysis")
def pathways_analysis(payload: PathwaysAnalysisInput):
    try:
        domains = ['full-stack', 'ai/ml', 'semiconductor', 'cybersecurity', 'product-management', 'search-data-infra']
        results = {}
        for d in domains:
            analysis = cv_service.perform_gap_analysis(
                domain_key=d,
                candidate_skills=payload.skills or [],
                candidate_role=payload.currentRole or 'Senior Frontend Engineer',
                current_ctc=payload.currentCtc or '₹7.5 LPA',
                current_company=payload.currentCompany,
                target_company=payload.targetCompany
            )
            results[d] = analysis
        return {"success": True, "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
