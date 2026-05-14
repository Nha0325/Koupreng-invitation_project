import os
from typing import Iterable

import httpx
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware


BACKEND_BASE_URL = os.getenv("SERVICE_BACKEND_BASE_URL", "http://localhost:8080").rstrip("/")
SERVICE_NAME = "Koupreng FastAPI Gateway"
DEFAULT_ALLOWED_ORIGINS = "http://localhost:5173,http://localhost:5174,http://localhost:5175"

HOP_BY_HOP_HEADERS = {
    "connection",
    "content-encoding",
    "content-length",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
}

app = FastAPI(
    title=SERVICE_NAME,
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.getenv("SERVICE_CORS_ALLOWED_ORIGINS", DEFAULT_ALLOWED_ORIGINS).split(",")
        if origin.strip()
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With", "X-Request-Id"],
    expose_headers=["X-Request-Id"],
)


@app.get("/")
@app.get("/health")
@app.get("/api/fastapi/health")
async def health():
    return {
        "status": "OK",
        "service": SERVICE_NAME,
        "backendBaseUrl": BACKEND_BASE_URL,
    }


@app.get("/api/service/health")
async def service_health():
    backend = await _backend_health()
    return {
        "status": "OK" if backend["status"] == "OK" else "DEGRADED",
        "service": SERVICE_NAME,
        "backend": backend,
    }


@app.api_route(
    "/api/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
)
async def proxy_backend(path: str, request: Request):
    target_url = _target_url(path, request)
    body = await request.body()
    headers = _forward_headers(request.headers.items(), request.client.host if request.client else None)

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            upstream = await client.request(
                request.method,
                target_url,
                content=body,
                headers=headers,
            )
    except httpx.RequestError:
        return {
            "status": 503,
            "error": "Service Unavailable",
            "message": "Spring Boot backend is not reachable",
        }

    response_headers = {
        key: value
        for key, value in upstream.headers.items()
        if key.lower() not in HOP_BY_HOP_HEADERS and key.lower() != "content-type"
    }

    return Response(
        content=upstream.content,
        status_code=upstream.status_code,
        headers=response_headers,
        media_type=upstream.headers.get("content-type"),
    )


async def _backend_health():
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{BACKEND_BASE_URL}/api/health")
        return {
            "status": "OK" if response.is_success else "ERROR",
            "statusCode": response.status_code,
            "url": f"{BACKEND_BASE_URL}/api/health",
        }
    except httpx.RequestError:
        return {
            "status": "ERROR",
            "statusCode": 503,
            "url": f"{BACKEND_BASE_URL}/api/health",
        }


def _target_url(path: str, request: Request) -> str:
    url = f"{BACKEND_BASE_URL}/api/{path}"
    if request.url.query:
        url = f"{url}?{request.url.query}"
    return url


def _forward_headers(headers: Iterable[tuple[str, str]], client_host: str | None) -> dict[str, str]:
    forwarded = {
        key: value
        for key, value in headers
        if key.lower() not in HOP_BY_HOP_HEADERS and key.lower() != "host"
    }

    if client_host:
        existing = forwarded.get("x-forwarded-for") or forwarded.get("X-Forwarded-For")
        forwarded["X-Forwarded-For"] = f"{existing}, {client_host}" if existing else client_host

    return forwarded
