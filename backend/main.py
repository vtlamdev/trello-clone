from fastapi import FastAPI, status, HTTPException, WebSocket, WebSocketDisconnect
from database.mongodb.database import DatabaseService
from pydantic import ValidationError
from fastapi.responses import JSONResponse
from shared_actions.models.message_response_model import MessageResponse
from modules.authentication_module.authentication_route import authentication_router
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from modules.operation_module.operation_route import operation_router
from pymongo.errors import PyMongoError
from modules.user_module.user_route import user_router
from modules.workspace_module.workspace_route import workspace_router
from config.constant import TESTING_MODE
from config.global_mode import GlobalMode
from config.config import config
from pymongo import MongoClient
from pymongo.errors import OperationFailure
from modules.board_module.board_route import board_router
from modules.card_module.card_route import card_router
from websocket.websocket import ConnectionManager

app = FastAPI()

manager = ConnectionManager()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup_event():
    global_mode: GlobalMode = GlobalMode.getInstance()
    database_service: DatabaseService = DatabaseService.getInstance()
    if global_mode.mode == TESTING_MODE:
        database_service.database_name = config["DATABASE_TESTING_NAME"]
    database_service.connect_database()


@app.on_event("shutdown")
def on_shutdown_event():
    database_service: DatabaseService = DatabaseService.getInstance()
    database_service.close_database()


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=MessageResponse(
            success=False, status_code=status.HTTP_400_BAD_REQUEST, data={}
        ).dict(),
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content=MessageResponse(
            success=False, status_code=exc.status_code, data={}
        ).dict(),
    )


@app.exception_handler(PyMongoError)
async def pymongo_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=MessageResponse(
            success=False, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, data={}
        ).dict(),
    )


@app.get("/")
async def index():
    return {"message": "place"}


app.include_router(
    authentication_router, tags=["authentication"], prefix="/authentication"
)
app.include_router(operation_router, tags=["operation"], prefix="/operation")
app.include_router(user_router, tags=["user"], prefix="/user")
app.include_router(workspace_router, tags=["workspace"], prefix="/workspace")
app.include_router(board_router, tags=["board"], prefix="/board")
app.include_router(card_router, tags=["card"], prefix="/card")


@app.websocket("/board")
async def websocket_endpoint(websocket: WebSocket, client_id: str, board_id: str):
    await manager.connect(websocket, client_id, board_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(data, board_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
