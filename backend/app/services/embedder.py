import requests
import numpy as np
import os

ML_SERVICE_URL = os.getenv("ML_SERVICE_URL", "http://ml-service:8080")

def get_embedding(text: str) -> np.ndarray:
    response = requests.post(
        f"{ML_SERVICE_URL}/vectors",
        json={"text": text}
    )
    response.raise_for_status()
    vector = response.json()["vector"]
    return np.array(vector)