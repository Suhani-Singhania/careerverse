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
DEV_SKIP_EMAIL = os.getenv("DEV_SKIP_EMAIL", "false").lower() == "true"

class EmailService:
    @staticmethod
    def send_otp_email(to_email: str, otp: str):
        if DEV_SKIP_EMAIL or not SMTP_HOST or not SMTP_USERNAME or not SMTP_PASSWORD:
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

        try:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
                server.starttls()
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.send_message(message)
            print(f"OTP email sent to {to_email}")
        except Exception as exc:
            print(f"Email send failed for {to_email}: {exc}")
            print(f"DEV OTP for {to_email}: {otp}")