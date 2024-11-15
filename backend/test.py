import os
import base64
import mimetypes
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Define the scope for Gmail API
SCOPES = ["https://www.googleapis.com/auth/gmail.send"]


def authenticate_user():
    # Start the OAuth flow to prompt for user login
    flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
    creds = flow.run_local_server(port=0)  # Opens a local server for user login
    return creds


def create_message_with_attachment(sender, to, subject, message_text, file_path=None):
    # Create the base message
    message = MIMEMultipart()
    message["to"] = to
    message["from"] = sender
    message["subject"] = subject

    # Attach the HTML body
    message.attach(MIMEText(message_text, "html"))

    # Attach a file if provided
    if file_path:
        content_type, encoding = mimetypes.guess_type(file_path)
        if content_type is None or encoding is not None:
            content_type = "application/octet-stream"
        main_type, sub_type = content_type.split("/", 1)

        with open(file_path, "rb") as file:
            file_content = MIMEBase(main_type, sub_type)
            file_content.set_payload(file.read())
            file_content.add_header(
                "Content-Disposition",
                "attachment",
                filename=os.path.basename(file_path),
            )
            message.attach(file_content)

    # Encode the message in base64 format for sending
    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
    return {"raw": raw_message}


def send_email(to, subject, message_text, file_path=None):
    # Authenticate the user each time
    creds = authenticate_user()
    try:
        # Build the Gmail API service with user credentials
        service = build("gmail", "v1", credentials=creds)
        sender = "me"  # 'me' represents the authenticated user
        message = create_message_with_attachment(
            sender, to, subject, message_text, file_path
        )
        send_message = (
            service.users().messages().send(userId="me", body=message).execute()
        )
        print(f"Email sent! Message ID: {send_message['id']}")
    except HttpError as error:
        print(f"An error occurred: {error}")


# Example usage
to = "deydsagnik@gmail.com"
subject = "Test Email"
message_text = "<h1>Hello</h1><p>This is a test email with an attachment.</p>"
file_path = "./resume.pdf"  # Replace with actual file path or None

send_email(to, subject, message_text, file_path)
