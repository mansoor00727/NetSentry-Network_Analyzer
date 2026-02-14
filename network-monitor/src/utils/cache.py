import os
import json
import redis.asyncio as redis
from typing import Optional, Any
from functools import wraps

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Global redis client
_redis_client = None

def get_redis_client():
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    return _redis_client

async def get_cached_data(key: str) -> Optional[Any]:
    client = get_redis_client()
    try:
        data = await client.get(key)
        if data:
            return json.loads(data)
    except Exception as e:
        print(f"Redis get error: {e}")
    return None

async def set_cached_data(key: str, data: Any, expire: int = 30):
    client = get_redis_client()
    try:
        await client.set(key, json.dumps(data), ex=expire)
    except Exception as e:
        print(f"Redis set error: {e}")

def cache_response(expire: int = 30):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Simple key generation based on function name and kwargs
            # For a real app, might need more robust key generation
            key = f"cache:{func.__name__}:{json.dumps(kwargs, sort_keys=True)}"
            
            cached = await get_cached_data(key)
            if cached:
                return cached
            
            result = await func(*args, **kwargs)
            await set_cached_data(key, result, expire=expire)
            return result
        return wrapper
    return decorator
