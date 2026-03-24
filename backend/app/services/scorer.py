import numpy as np
from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def compute_score(vec1: np.ndarray, vec2: np.ndarray) -> float:
    dot_product = np.dot(vec1, vec2)
    norm = np.linalg.norm(vec1) * np.linalg.norm(vec2)
    if norm == 0:
        return 0.0
    return float(dot_product / norm)

def generate_feedback(cv_text: str, job_description: str, score: float) -> str:
    prompt = f"""You are a professional CV reviewer. A candidate's CV has been matched against a job description with a score of {score}%.

CV:
{cv_text}

Job Description:
{job_description}

Provide concise, actionable feedback covering:
- Key strengths from the CV that match this role
- Important skills or experience missing from the CV
- Specific suggestions to improve the CV for this role

Write each of these actions in a new line

Keep your response focused and under 200 words."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=400
    )

    return response.choices[0].message.content