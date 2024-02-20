import smtplib
from email.mime.text import MIMEText
from shared_actions.models.email_model import EmailSendingRequest

def send_smtp_email(email_sending_request: EmailSendingRequest) -> bool:
    is_sent = False
    
    try:
        message = MIMEText(email_sending_request.body, "html")
        message["Subject"] = email_sending_request.subject
        message["From"] = email_sending_request.sender
        message["To"] = ",".join(email_sending_request.recipients)
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp_server:
            smtp_server.login(email_sending_request.sender, email_sending_request.password)
            smtp_server.sendmail(email_sending_request.sender, email_sending_request.recipients, message.as_string())
        is_sent = True
    except:
        print("error")
    
    return is_sent