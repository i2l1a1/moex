import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from routers import router
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    from routers import moex_data
    await moex_data.aclose()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("main:app", port=9091, reload=True)
