import os
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
import base64
from email.mime.text import MIMEText

SCOPES = ["https://www.googleapis.com/auth/gmail.modify"]


def GMail_API():
    creds = None
    cred_path = os.path.join(os.path.dirname(__file__), "credentials.json")
    token_path = os.path.join(os.path.dirname(__file__), "token.json")

    # Load existing credentials
    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    # Refresh or request new credentials if needed
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(cred_path, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_path, "w") as token_file:
            token_file.write(creds.to_json())

    # Create Gmail service
    service = build("gmail", "v1", credentials=creds)
    return service


def create_email_message(subject: str, body: str, recipient_email: str):
    message = MIMEText(body, "html")
    message["to"] = recipient_email
    message["from"] = "deydsagnik48@gmail.com"
    message["subject"] = subject
    return {"raw": base64.urlsafe_b64encode(message.as_bytes()).decode()}


if __name__ == "__main__":
    service = GMail_API()
    email_message = create_email_message("testing", "Hi, this is just a test", "deydsagnik@gmail.com")
    service.users().messages().send(userId="me", body=email_message).execute()