import os
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
from dotenv import load_dotenv
import PyPDF2 as pdf

load_dotenv()


class Generate:
    def __init__(self):
        self.llm = ChatGroq(
            temperature=0,
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama-3.1-70b-versatile",
        )
    def extract_resume(self, file_path):
        reader = pdf.PdfReader(file_path)
        resume = ""
        for page in range(len(reader.pages)):
            page = reader.pages[page]
            resume += str(page.extract_text())
        return resume
    def extract_jobs(self, formatted_text):
        prompt_extract = PromptTemplate.from_template(
            """
            ### SCRAPED TEXT FROM WEBSITE:
            {page_data}
            ### INSTRUCTION:
            The scraped text is from the career's page of a website.
            Your job is to extract the job postings only of the job posting where there is proper description and return them in JSON format containing the following keys: `role`, `experience`, `skills`, `requirements(if any)`, `Preferred or something close to this (if any)` `description`.
            Only return the valid JSON.
            ### VALID JSON (NO PREAMBLE):    
            """
        )
        chain_extract = prompt_extract | self.llm
        res = chain_extract.invoke(input={"page_data": formatted_text})
        try:
            json_parser = JsonOutputParser()
            res = json_parser.parse(res.content)
        except OutputParserException:
            raise OutputParserException("Context too big. Unable to parse jobs.")
        return res if isinstance(res, list) else [res]

    def write_mail(self, job, links, resume):
        prompt_email = PromptTemplate.from_template(
            """
            ### JOB DESCRIPTION:
            {job_description}
            
            ### RESUME TEXT:
            {resume_text}
            
            ### PROJECTS LINK (OPTIONAL BUT SHOULD GIVE IF POSSIBLE PROJECT LINKS):
            {links_list}
            
            ### INSTRUCTION:
            You are a hiring assistant responsible for reviewing the resume of a candidate. The resume text provided may belong to 
            a different person. Your task is to carefully analyze the content of the resume, identify relevant experience, skills, 
            and projects that match the job description provided above. 
            
            Craft a tailored cold email application that highlights the candidate's technical skills (in points), educational qualifications, achievements, and 
            experiences aligning with the job requirements. 
            If applicable, refer to relevant projects from the provided links to 
            strengthen the candidate's profile for this specific role.
            
            Ensure the email is professional, concise, and directly addresses the needs and expectations outlined in the job description.

            Also mention relevant project links as mentioned in the PROJECT LINKS SECTION for the job. Also note that these projects are 
            different from the projects mentioned in the resume. So Give links with the project name accordingly.

            At first try to mention the skills from the {resume_text} (same as somewhat matches the skills in the job_description)
            ### EMAIL (NO PREAMBLE):
            """
        )
        chain_email = prompt_email | self.llm
        res = chain_email.invoke({"job_description": str(job), "resume_text": resume, "links_list": links})
        return res.content


if __name__ == "__main__":
    print(os.getenv("GROQ_API_KEY"))
