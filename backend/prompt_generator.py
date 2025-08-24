import os
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
from dotenv import load_dotenv
import PyPDF2 as pdf

load_dotenv()


class Generate:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
        api_key = os.getenv("GEMINI_API_KEY"),
        model="gemini-2.0-flash",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        ) 
    def extract_resume(self, file_path):
        reader = pdf.PdfReader(file_path)
        resume = ""
        for page in range(len(reader.pages)):
            page = reader.pages[page]
            resume += str(page.extract_text())
        return resume

    def extract_company_name(self, job_description):
        prompt_extract = PromptTemplate.from_template(
            """
            ### SCRAPED TEXT FROM WEBSITE:
            {page_data}
            ### INSTRUCTION:
            The scraped text is from the career page or job posting of a company website.
            Your task is to extract the company name accurately and return it in JSON format with the key `company_name`.
            Only return the valid JSON with no additional text or explanation.
            ### VALID JSON FORMAT (NO PREAMBLE):
            """
        )
        chain_extract = prompt_extract | self.llm
        res = chain_extract.invoke(input={"page_data": job_description})
        try:
            json_parser = JsonOutputParser()
            res = json_parser.parse(res.content)
        except OutputParserException:
            raise OutputParserException("Context too big or ambiguous. Unable to parse company name.")

        return res if isinstance(res, dict) else {"company_name": res}

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

            ### PROJECTS LINK (optional, if any):
            {links_list}

            ### INSTRUCTION:
            You are a hiring assistant drafting a professional HTML cold email for a candidate applying to the job described. Analyze the resume to identify experience, skills, and projects that match the job description. The email should be concise, visually appealing, and highlight the candidate’s qualifications with clear sections in HTML format.

            **Generate the response in JSON with the following format:**
            - "subject": A concise and relevant subject line.
            - "body": The HTML content of the email, formatted as follows:

            FOLLOW THESE WHEN WRITING THE E-MAIL (Also don't mention them as headings in the E-MAIL rather as paragraphs. Also bold and make them italic as necessary):
            1. Briefly express my enthusiasm for the role explaining why i perfectly fit for the role (give information based on my resume)
            2. Provide a bullet-point list of relevant skills from `{resume_text}` that align with `{job_description}`, with key points in bold. [make keywords bold and italic]
            3. List specific projects that demonstrate relevant experience, using links from `{links_list}` and descriptive project names if provided. [make keywords bold and italic]
            4. Summarize the candidate’s educational background and notable achievements that support their fit for the role. [make keywords bold and italic]
            5. Also mention and write a little bit about the projects(one by one) on my resume. [make keywords bold and italic]
            6. Close with a professional statement, expressing interest in discussing qualifications further.
            7. Lastly, end the mail with formal thanks, my name and my contact details (with clickable links as target="_blank")

            The body should be in HTML format only and nothing else no *** or ** or ***_ _*** or * markdown styling, with the following requirements:
            - Bold key skills and qualifications.
            - Italic project names.
            - Use appropriate HTML tags for structure (e.g., `<h1>`, `<p>`, `<ul>`, `<li>`).
            - Ensure the email is visually appealing and easy to read.
            - Use a professional tone and language.
            - Use proper HTML formatting for links, ensuring they are clickable.
            - Use `<strong>` for emphasis on key points.
            - Use `<ul>` and `<li>` for lists.
            - Use `<a href="URL" target="_blank">Link Text</a>` for clickable links.
            - Use `<p>` for paragraphs.
            - Use `<h1>`, `<h2>`, etc., for headings.
            - Use `<br>` for line breaks.
            - Use `<b>` for bold text.
            - Use `<i>` for italic text.
            - Use `<div>` for sections.
            - Use `<span>` for inline styling.
            - Use `<strong>` for strong emphasis.
            - Use `<em>` for emphasis.
            - Use `<blockquote>` for quotes.
            - Use `<code>` for code snippets.
            - Use bullet points for lists.
            - Links from `{links_list}` should be clickable URLs with project names.

            Return the response strictly in JSON format without any additional details.
            """
        )
        chain_email = prompt_email | self.llm
        res = chain_email.invoke({"job_description": str(job), "resume_text": resume, "links_list": links})
        json_parser = JsonOutputParser()
        try:
            return json_parser.parse(res.content)
        except OutputParserException:
            raise OutputParserException("Error in parsing JSON response.")


if __name__ == "__main__":
    print(os.getenv("GROQ_API_KEY"))

    llm = ChatGoogleGenerativeAI(
    api_key = os.getenv("GEMINI_API_KEY"),
    model="gemini-2.0-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # other params...
)
