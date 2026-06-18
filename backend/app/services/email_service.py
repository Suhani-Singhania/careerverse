import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()


SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
EMAIL_FROM = os.getenv("EMAIL_FROM", SMTP_USERNAME)
print("SMTP_HOST:", SMTP_HOST)
print("SMTP_USERNAME:", SMTP_USERNAME)
print("SMTP_PASSWORD exists:", bool(SMTP_PASSWORD))

class EmailService:
    @staticmethod
    def send_otp_email(to_email: str, otp: str):
        if not SMTP_HOST or not SMTP_USERNAME or not SMTP_PASSWORD:
            print(f"DEV OTP for {to_email}: {otp}")
            return

        message = EmailMessage()
        message["Subject"] = "Your CareerVerse login OTP"
        message["From"] = EMAIL_FROM
        message["To"] = to_email

        message.set_content(
            f"""
Your CareerVerse login code is:

{otp}

This code will expire in 5 minutes.

If you did not try to log in, you can ignore this email.
"""
        )

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(message)