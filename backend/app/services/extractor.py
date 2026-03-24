import pdfplumber
import docx
import io

def extract_text(file_bytes: bytes, filename: str) -> str:
    filename  =filename.lower()

    if filename.endswith('.pdf'):
        return extract_from_pdf(file_bytes)
    if filename.endswith('.docx'):
        return extract_from_docx(file_bytes)
    else:
        return ValueError("This document type is not supported")
    


def extract_from_pdf(file_bytes: bytes):
    text = ""

    with (pdfplumber.open(io.BytesIO(file_bytes))) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if(page_text):
                text += page_text + "\n"

    return text.strip()


def extract_from_docx(file_bytes: bytes):
    doc = docx.Document(io.BytesIO(file_bytes))
    text = "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
    return text.strip()