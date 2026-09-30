from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from backend.data.jobs_db import JOBS_DB

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

@router.get("")
def get_jobs(
    domain: Optional[str] = None,
    q: Optional[str] = None,
    loc: Optional[str] = None,
    minSalary: Optional[float] = Query(default=None),
    trackKey: Optional[str] = None
):
    try:
        jobs_list = list(JOBS_DB)

        if domain and domain != 'all':
            d = domain.lower()
            jobs_list = [j for j in jobs_list if d in j.domain.lower() or j.domain.lower() in d]

        if trackKey:
            tk = trackKey.lower()
            if tk == 'arch':
                jobs_list = [j for j in jobs_list if j.domain == 'Full-Stack']
            elif tk == 'pm':
                jobs_list = [j for j in jobs_list if j.domain == 'Product Management']
            elif tk == 'search':
                jobs_list = [j for j in jobs_list if j.domain == 'Search & Data Infra']
            elif tk == 'ai':
                jobs_list = [j for j in jobs_list if j.domain == 'AI/ML']
            elif tk == 'semi':
                jobs_list = [j for j in jobs_list if j.domain == 'Semiconductor']

        if loc and loc != 'all':
            l = loc.lower()
            jobs_list = [j for j in jobs_list if l in j.loc.lower()]

        if q and q.strip():
            query = q.lower().strip()
            jobs_list = [
                j for j in jobs_list
                if query in j.title.lower()
                or query in j.company.lower()
                or any(query in s.lower() for s in j.requiredSkills)
                or query in j.loc.lower()
            ]

        if minSalary is not None:
            jobs_list = [j for j in jobs_list if (j.salaryNum or 0) >= minSalary]

        return {
            "success": True,
            "count": len(jobs_list),
            "data": jobs_list
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{job_id}")
def get_job_by_id(job_id: str):
    job = next((j for j in JOBS_DB if j.id == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job with ID {job_id} not found")
    return {"success": True, "data": job}
