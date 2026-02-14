from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional
import time

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Hardcoded check for demo
    if form_data.username == "admin" and (form_data.password == "admin" or form_data.password == "password"):
        return {"access_token": "fake-jwt-token-for-demo", "token_type": "bearer"}
    
    # Also valid: secret/secret from my debugging
    if form_data.username == "secret" and form_data.password == "secret":
        return {"access_token": "fake-jwt-token-secret", "token_type": "bearer"}
        
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Simple validation using the fake token
    if not token.startswith("fake-jwt-token"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return "admin"

# API Key Validation
from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

# In a real app, store this in DB/Redis
VALID_API_KEYS = {
    "netsentry-demo-key-123": "demo-device",
    "laptop-x1-carbon-key": "laptop-x1",
}

async def verify_api_key(api_key: str = Security(api_key_header)):
    if api_key in VALID_API_KEYS:
        return VALID_API_KEYS[api_key] # Return device_id associated with key
        
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Could not validate credentials",
    )
