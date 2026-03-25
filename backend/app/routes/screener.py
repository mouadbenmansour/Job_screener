from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.extractor import extract_text
from app.services.embedder import get_embedding
from app.services.scorer import compute_score, generate_feedback

router = APIRouter()

@router.post("/analyse")
async def analyse(cv: UploadFile = File(...), job_description: str = Form(...)):
    try:
        # Extract text from CV
        cv_bytes = await cv.read()
        cv_text = extract_text(cv_bytes, cv.filename)

        # Get embeddings from ml-service
        cv_vector = get_embedding(cv_text)
        jd_vector = get_embedding(job_description)

        # Compute match score
        score = compute_score(cv_vector, jd_vector)

        # Generate LLM feedback
        feedback = generate_feedback(cv_text, job_description, score)

        return {
            "score": round(score * 100, 1),
            "feedback": feedback
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))