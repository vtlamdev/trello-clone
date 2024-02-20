from shared_actions.operations.data_operation import validate_text

def is_email_valid(email: str) -> bool:
    is_valid = False
    email_pattern = "^[a-zA-Z0-9]+@[a-zA-Z]+[a-zA-Z.]*[a-zA-Z]+$"

    if validate_text(email, email_pattern):
        is_valid = True
    
    return is_valid