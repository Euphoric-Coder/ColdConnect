from langchain_community.document_loaders import WebBaseLoader
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, Form
from io import BytesIO
import uvicorn
from prompt_generator import Generate
from text_format import clean_text
from project import Portfolio
import PyPDF2 as pdf

app = FastAPI()

# Allow CORS for frontend communication
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
        # Read and process resume
        resume_bytes = await resume.read()
        pdf_reader = pdf.PdfReader(BytesIO(resume_bytes))
        resume_text = ""
        for page in pdf_reader.pages:
            resume_text += page.extract_text()

        loader = WebBaseLoader([job_url])
        job_description = clean_text(loader.load().pop().page_content)
        print(job_description)
        # Clean the job description
        cleaned_data = clean_text(job_description)
        # Extract jobs and generate email
        portfolio.load_portfolio()
        jobs = chain.extract_jobs(cleaned_data)
        for job in jobs:
            skills = job.get("skills", [])
            links = portfolio.query_links(skills)
            email = chain.write_mail(job, links, resume_text)
            print(email)
            return {"email": email}
    except Exception as e:
        return {"error": str(e)}


# Run the app with: uvicorn main:app --reload
if __name__ == "__main__":
    uvicorn.run("main:app", host='localhost', port=8900, reload=True)