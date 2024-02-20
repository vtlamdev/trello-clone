from fastapi import APIRouter, Depends, status
from modules.board_module.board_model import BoardAddRequest, BoardVisibility, Board, BoardUpdateRequest, BoardAggregation, BoardChangeVisibilityRequest, BoardMoveListRequest, BoardInviteMemberRequest, BoardAddListRequest, BoardUpdateListRequest, BoardArchiveListRequest, BoardStarRequest, BoardLeaveRequest,AssignMemberRequest
from shared_actions.dependencies.authentication.authentication_dependency import verify_token
from modules.board_module.board_service import BoardService
from shared_actions.services.authorization.workspace_authorization_service import WorkspaceAuthorizationService
from bson.objectid import ObjectId
from modules.user_module.user_model import UserRole
from shared_actions.models.message_response_model import MessageResponse
from shared_actions.operations.data_operation import clean_dict
from fastapi.responses import JSONResponse
from shared_actions.services.authorization.board_authorization_service import BoardAuthorizationService

board_router = APIRouter()
board_service = BoardService()
workspace_authorization_service = WorkspaceAuthorizationService()
board_authorization_service = BoardAuthorizationService()

@board_router.get("/{board_id}")
def get_board(board_id: str, payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    board_aggregation: BoardAggregation = board_service.get_board(ObjectId(board_id), ObjectId(data["user_id"]))
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(board_aggregation.dict()))
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@board_router.post("/")
def add_board(board_add_request: BoardAddRequest, payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    if board_add_request.visibility == BoardVisibility.PUBLIC:
        workspace_authorization_service.require_role(ObjectId(data["user_id"]), ObjectId(board_add_request.workspace_id), [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER])
    elif board_add_request.visibility == BoardVisibility.WORKSPACE:
        workspace_authorization_service.require_role(ObjectId(data["user_id"]), ObjectId(board_add_request.workspace_id), [UserRole.OWNER, UserRole.ADMIN])
    elif board_add_request.visibility == BoardVisibility.PRIVATE:
        workspace_authorization_service.require_role(ObjectId(data["user_id"]), ObjectId(board_add_request.workspace_id), [UserRole.OWNER])
    board: Board = board_service.add_board(board_add_request, ObjectId(data["user_id"]))
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(board.dict()))
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@board_router.put("/")
def update_board(board_update_request: BoardUpdateRequest, payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    board_authorization_service.validate_update_board_request(ObjectId(data["user_id"]), ObjectId(board_update_request.board_id), [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER])
    board: Board = board_service.update_board(board_update_request)
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(board.dict()))
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@board_router.put("/changeVisibility")
def change_visibility(board_change_visibility_request: BoardChangeVisibilityRequest, payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    board_authorization_service.validate_update_board_request(ObjectId(data["user_id"]), ObjectId(board_change_visibility_request.board_id), [UserRole.OWNER, UserRole.ADMIN])
    board: Board = board_service.change_visibility(board_change_visibility_request, ObjectId(data["user_id"]))
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(board.dict()))
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@board_router.put("/addList")
def add_list(board_add_list_request: BoardAddListRequest, payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    board_authorization_service.validate_update_board_request(ObjectId(data["user_id"]), ObjectId(board_add_list_request.board_id), [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER])
    board: Board = board_service.add_list(board_add_list_request)
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(board.dict()))
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@board_router.put("/updateList")
def update_list(board_update_list_request: BoardUpdateListRequest, payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    board_authorization_service.validate_update_board_request(ObjectId(data["user_id"]), ObjectId(board_update_list_request.board_id), [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER])
    board: Board = board_service.update_list(board_update_list_request)
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(board.dict()))
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@board_router.put("/moveList")
def move_list(board_move_list_request: BoardMoveListRequest, payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    board_authorization_service.validate_update_board_request(ObjectId(data["user_id"]), ObjectId(board_move_list_request.board_id), [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER])
    board: Board = board_service.move_list(board_move_list_request)
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(board.dict()))
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@board_router.put("/archiveList")
def archive_list(board_archive_list_request: BoardArchiveListRequest, payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    board_authorization_service.validate_update_board_request(ObjectId(data["user_id"]), ObjectId(board_archive_list_request.board_id), [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER])
    board: Board = board_service.archive_list(board_archive_list_request)
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(board.dict()))
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@board_router.put("/unarchiveList")
def archive_list(board_archive_list_request: BoardArchiveListRequest, payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    board_authorization_service.validate_update_board_request(ObjectId(data["user_id"]), ObjectId(board_archive_list_request.board_id), [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER])
    board: Board = board_service.un_archive_list(board_archive_list_request)
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(board.dict()))
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@board_router.put("/inviteMember")
def invite_member(board_invite_member_request: BoardInviteMemberRequest, payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    board_authorization_service.validate_invite_member_request(ObjectId(data["user_id"]), ObjectId(board_invite_member_request.user_id), ObjectId(board_invite_member_request.board_id), [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER])
    board: Board = board_service.invite_member(board_invite_member_request)
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(board.dict()))
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@board_router.put("/starBoard")
def star_board(board_star_request: BoardStarRequest, payload: dict=Depends(verify_token)):
    data: dict=payload["data"]
    board:Board = board_service.star_boad(ObjectId(board_star_request.board_id) ,ObjectId(data["user_id"]))
    message_response:MessageResponse=MessageResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(board.dict()))
    return JSONResponse(status_code=status.HTTP_200_OK, content= message_response.dict())

@board_router.put("/leaveBoard")
def leave_board(board_leave_request: BoardLeaveRequest, payload: dict=Depends(verify_token)):
    data: dict=payload["data"]
    board:Board = board_service.leave_board(ObjectId(board_leave_request.board_id) ,ObjectId(data["user_id"]))
    message_response:MessageResponse=MessageResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(board.dict()))
    return JSONResponse(status_code=status.HTTP_200_OK, content= message_response.dict())

@board_router.put("/assignMember")
def assign_member(assign_member_request: AssignMemberRequest, payload: dict=Depends(verify_token)):
    data: dict=payload["data"]
    board:Board = board_service.assign_member(ObjectId(assign_member_request.board_id), ObjectId(assign_member_request.member_id),ObjectId(data["user_id"]))
    message_response:MessageResponse=MessageResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(board.dict()))
    return JSONResponse(status_code=status.HTTP_200_OK, content= message_response.dict())


