from fastapi import APIRouter, Depends, status, Body
from modules.workspace_module.workspace_model import WorkspaceAddRequest, Workspace, WorkspaceUpdateRequest, WorkspaceList, WorkspaceListAggregation, WorkspaceInviteMemberRequest, WorkspaceChangeRoleRequest, WorkspaceAggregation, SearchResponse
from shared_actions.dependencies.authentication.authentication_dependency import verify_token
from modules.workspace_module.workspace_service import WorkspaceService
from shared_actions.models.message_response_model import MessageResponse
from fastapi.responses import JSONResponse
from bson.objectid import ObjectId
from shared_actions.operations.data_operation import clean_dict
from shared_actions.services.authorization.workspace_authorization_service import WorkspaceAuthorizationService
from modules.user_module.user_model import UserRole
from shared_actions.models.message_list_response_model import MessageListResponse
from typing import Union

workspace_router = APIRouter()
workspace_service = WorkspaceService()
workspace_authorization_service = WorkspaceAuthorizationService()

@workspace_router.get("/")
def get_workspaces(payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    workspace_list_aggregation: WorkspaceListAggregation = workspace_service.get_workspaces(ObjectId(data["user_id"]))
    message_list_response: MessageListResponse = MessageListResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(workspace_list_aggregation.dict()["workspaces"]))
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_list_response.dict())

@workspace_router.get("/{workspace_id}")
def get_workspace(workspace_id: str, payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    workspace_aggregation: WorkspaceAggregation = workspace_service.get_workspace(ObjectId(data["user_id"]), ObjectId(workspace_id))
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(workspace_aggregation.dict()))
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@workspace_router.get("/search/search-all")
def search(keyword: Union[str,None]=None,workspace_offset:int=0,board_offset:int=0, workspace_limit:int=5, board_limit:int=5,payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    search_response: SearchResponse  = workspace_service.search(keyword,workspace_offset,board_offset,workspace_limit,board_limit, ObjectId(data["user_id"]))
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=search_response.dict())
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@workspace_router.post("/")
def add_workspace(workspace_add_request: WorkspaceAddRequest = Body(...), payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    workspace: Workspace = workspace_service.add_workspace(workspace_add_request, ObjectId(data["user_id"]))
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(workspace.dict()))
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@workspace_router.put("/")
def update_workspace(workspace_update_request: WorkspaceUpdateRequest = Body(...), payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    workspace_authorization_service.require_role(ObjectId(data["user_id"]), ObjectId(workspace_update_request.workspace_id), [UserRole.OWNER, UserRole.ADMIN])
    workspace: Workspace = workspace_service.update_workspace(workspace_update_request)
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(workspace.dict()))
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@workspace_router.put("/inviteMember")
def invite_member(workspace_invite_member_request: WorkspaceInviteMemberRequest = Body(...), payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    workspace_authorization_service.require_role(ObjectId(data["user_id"]), ObjectId(workspace_invite_member_request.workspace_id), [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER])
    workspace: Workspace = workspace_service.invite_member(workspace_invite_member_request)
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(workspace.dict()))
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@workspace_router.put("/changeRole")
def change_role(workspace_change_role_request: WorkspaceChangeRoleRequest = Body(...), payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    workspace_authorization_service.validate_change_role_request(ObjectId(data["user_id"]), ObjectId(workspace_change_role_request.user_id), ObjectId(workspace_change_role_request.workspace_id), workspace_change_role_request.role)
    workspace: Workspace = workspace_service.change_role(workspace_change_role_request)
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(workspace.dict()))
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@workspace_router.put("/removeMember")
def remove_member(workspace_remove_member_request: WorkspaceChangeRoleRequest  = Body(...), payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    workspace_authorization_service.validate_change_role_request(ObjectId(data["user_id"]), ObjectId(workspace_remove_member_request.user_id), ObjectId(workspace_remove_member_request.workspace_id), workspace_remove_member_request.role)
    workspace: Workspace = workspace_service.remove_member(workspace_remove_member_request)
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data={})
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@workspace_router.delete("/{workspace_id}")
def delete_workspace(workspace_id: str, payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    workspace_authorization_service.require_role(ObjectId(data["user_id"]), ObjectId(workspace_id), roles=[UserRole.OWNER])
    workspace_service.delete_workspace(ObjectId(workspace_id))
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data={})
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())
