from supabase import create_client, Client
from config import settings

def get_service_supabase() -> Client:
    """
    Returns a generic admin/service Supabase client for backend operations
    that shouldn't be executed under a specific user context (bypassing RLS).
    """
    key = settings.supabase_service_key if settings.supabase_service_key else settings.supabase_anon_key
    if not settings.supabase_url or not key:
        print("Warning: Supabase credentials not fully configured in environment.")
    return create_client(settings.supabase_url or "", key or "")

supabase_admin = get_service_supabase()
