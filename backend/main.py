from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from api import auth, centers, fleet, inventory, whatsapp, sitrep, logs, websocket, webhook


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    from tasks.agent_runner import start_background_agents
    await start_background_agents()
    yield
    # Shutdown (nothing special needed)


def create_app() -> FastAPI:
    app = FastAPI(
        title="AEOC - Autonomous Emergency Operations Center",
        version="1.0.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # REST routers
    app.include_router(auth.router, prefix="/api")
    app.include_router(centers.router, prefix="/api")
    app.include_router(fleet.router, prefix="/api")
    app.include_router(inventory.router, prefix="/api")
    app.include_router(whatsapp.router, prefix="/api")
    app.include_router(sitrep.router, prefix="/api")
    app.include_router(logs.router, prefix="/api")

    # WebSocket
    app.include_router(websocket.router)

    # Twilio webhook (no /api prefix — Twilio posts to /webhook/...)
    app.include_router(webhook.router)

    return app


app = create_app()