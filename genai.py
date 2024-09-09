import os
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
from dotenv import load_dotenv

load_dotenv()


class Chain:
    def __init__(self):
        self.llm = ChatGroq(
            temperature=0,
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama-3.1-70b-versatile",
        )

    def extract_jobs(self, formatted_text):
        prompt_extract = PromptTemplate.from_template(
            """
            ### SCRAPED TEXT FROM WEBSITE:
            {page_data}
            ### INSTRUCTION:
            The scraped text is from the career's page of a website.
            Your job is to extract the job postings only of the job posting where there is proper description and return them in JSON format containing the 
            following keys: `role`, `experience`, `skills`, `requirements(if any)`, `Preferred or something close to this (if any)` `description`.
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

    def write_mail(self, job, links):
        prompt_email = PromptTemplate.from_template(
            """
            ### JOB DESCRIPTION:
            {job_description}

            ### RESUME TEXT:
            {resume_text}

            ### PROJECTS LINK:
            {links_list}

            ### INSTRUCTION:
            You are a passionate Software Developer now a Technical Recruiter with experience in most of the Domains of IT for 20 years and now recuit Senior Position of Software Developers.\
            Your job is to write a cold email to the client regarding the job mentioned above describing the capability of AtliQ 
        in fulfilling their needs. 
            Your job is to apply for the job mentioned above, demonstrating how your skills, experience, and projects align with the job description and the needs of the company. Utilize the text from the resume and, if applicable, refer to relevant projects from the provided links to showcase your suitability for the role.

            Focus on highlighting your relevant experience, achievements, and skills that match the job description. Ensure the email is professional, concise, and tailored to the specific company and position.

            ### EMAIL (NO PREAMBLE):
            """
        )
        chain_email = prompt_email | self.llm
        res = chain_email.invoke({"job_description": str(job), "link_list": links})
        return res.content


if __name__ == "__main__":
    print(os.getenv("GROQ_API_KEY"))
