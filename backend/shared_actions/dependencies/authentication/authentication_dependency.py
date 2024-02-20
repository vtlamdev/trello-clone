from fastapi import Header, HTTPException, status
import jwt
from config.config import config
from typing import Union

async def verify_token(authorization: Union[str, None] = Header(...)):
    if authorization is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    try:
        payload = jwt.decode(authorization, config["PRIVATE_KEY"], algorithms=[config["ALGORITHM"]])
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    return payload