from fastapi import WebSocket, WebSocketDisconnect
from fastapi import HTTPException, status
from typing import Union, List
from bson.objectid import ObjectId
from database.mongodb.database import DatabaseService
from config.constant import (
    WORKSPACE_COLLECTION,
)


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[dict] = []
        self.database_service: DatabaseService = DatabaseService.getInstance()
        self.database = self.database_service.database
        self.workspace_collection = self.database[WORKSPACE_COLLECTION]

    async def connect(self, websocket: WebSocket, client_id: str, board_id: str):
        await websocket.accept()
        self.active_connections.append(
            {"client_id": client_id, "websocket": websocket, "board_id": board_id}
        )
        print(self.active_connections)

    def disconnect(self, websocket: WebSocket):
        self.active_connections = list(
            filter(
                lambda connection: connection["websocket"] != websocket,
                self.active_connections,
            )
        )
        print(self.active_connections, len(self.active_connections))

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str, board_id: str):

        workspace: Union[dict, None] = self.workspace_collection.find_one(
            {
                "boards": ObjectId(board_id),
            }
        )

        for connection in self.active_connections:
            is_included = False
            for member in workspace["members"]:
                if member["user_id"] == ObjectId(connection["client_id"]):
                    is_included = True
            if is_included and connection["board_id"] == board_id:
                await connection["websocket"].send_text(message)
