from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow all origins (for development only!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["https://friendly-space-waddle-q77gvvqgjvggfp9x-8080.app.github.dev"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from Python backend 👋"}
