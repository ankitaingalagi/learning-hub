from fastapi import Header, HTTPException, Depends
from supabase import create_client, Client
from config import settings
from typing import Optional

def get_current_user_token(authorization: Optional[str] = Header(None)) -> str:
    """Extract and validate the Bearer token."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authentication token")
    return authorization.split(" ")[1]

def get_user_supabase(token: str = Depends(get_current_user_token)) -> Client:
    """
    Returns a Supabase client authenticated *as* the request user.
    When this client is used to query the DB, all Row-Level Security (RLS) policies 
    will automatically apply exactly as if they queried from the frontend!
    """
    client = create_client(
        settings.supabase_url,
        settings.supabase_anon_key,
    )
    # Inject the user's JWT into the Postgrest headers
    client.postgrest.auth(token)
    return client
    
def get_current_user(client: Client = Depends(get_user_supabase)):
    """Verifies the token via Supabase Auth and returns the User object."""
    try:
        user_response = client.auth.get_user()
        if not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid session or token")
        return user_response.user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")
