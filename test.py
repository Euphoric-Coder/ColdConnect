import streamlit as st
import PyPDF2 as pdf
from io import BytesIO

# Streamlit app interface
st.title("PDF Text Extractor")

# Create a file uploader widget
uploaded_file = st.file_uploader("Choose a PDF file", type="pdf")

if uploaded_file is not None:
    # Read the uploaded file into a BytesIO object
    pdf_file = BytesIO(uploaded_file.read())

    # Initialize PyPDF2 PDF reader
    reader = pdf.PdfReader(pdf_file)
    resume = ""
    for page in range(len(reader.pages)):
        page = reader.pages[page]
        resume += str(page.extract_text())
    

    # Display the extracted text
    st.write("Extracted Text:")
    st.text_area("Text from PDF", resume, height=300)
