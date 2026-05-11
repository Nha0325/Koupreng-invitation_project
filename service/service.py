from fastapi import FastAPI

app = FastAPI(
    title="E-Invitation FastAPI Service",
    version="1.0.0"
)

@app.get("/")
@app.get("/health")
@app.get("/api/fastapi/health")
def health():
    return {
        "status": "OK",
        "service": "FastAPI Microservice"
    }
