from fastapi import APIRouter, Depends, HTTPException
from dependencies import get_user_supabase, get_current_user
from supabase import Client
from models.programs import ProgramResponse
from typing import List

router = APIRouter(prefix="/api/programs", tags=["Programs"])

@router.get("/", response_model=List[ProgramResponse])
def get_programs(client: Client = Depends(get_user_supabase)):
    """
    Fetch all active programs.
    RLS is enforced: The query uses the client authenticated with the user's token.
    """
    try:
        response = client.table("programs").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase query failed: {str(e)}")
