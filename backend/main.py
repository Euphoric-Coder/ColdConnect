from fastapi.middleware.cors import CORSMiddleware
from langchain_community.document_loaders import WebBaseLoader
from fastapi import FastAPI, UploadFile, Form
from io import BytesIO
import uvicorn
from prompt_generator import Generate
from text_format import clean_text
from project import Portfolio
import PyPDF2 as pdf
from authenticate import GMail_API, create_email_message

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chain = Generate()
portfolio = Portfolio()


@app.post("/generate-email")
async def generate_email(job_url: str = Form(...), resume: UploadFile = Form(...)):
    try:
        resume_bytes = await resume.read()
        pdf_reader = pdf.PdfReader(BytesIO(resume_bytes))
        resume_text = ""
        for page in pdf_reader.pages:
            resume_text += page.extract_text()

        loader = WebBaseLoader([job_url])
        job_description = clean_text(loader.load().pop().page_content)

        portfolio.load_portfolio()
        jobs = chain.extract_jobs(job_description)
        for job in jobs:
            skills = job.get("skills", [])
            links = portfolio.query_links(skills)
            email_data = chain.write_mail(job, links, resume_text)
            return {"subject": email_data["subject"], "body": email_data["body"]}
    except Exception as e:
        return {"error": str(e)}


@app.post("/send-email")
async def send_email(
    recipient_email: str = Form(...), subject: str = Form(...), body: str = Form(...)
):
    try:
        service = GMail_API()
        email_message = create_email_message(subject, body, recipient_email)
        service.users().messages().send(userId="me", body=email_message).execute()
        return {"message": "Email sent successfully"}
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8900, reload=True)
