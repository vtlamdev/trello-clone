from fastapi import APIRouter, Depends, status, Body
from bson.objectid import ObjectId
from fastapi.responses import JSONResponse
from shared_actions.models.message_response_model import MessageResponse
from shared_actions.models.message_list_response_model import MessageListResponse
from shared_actions.dependencies.authentication.authentication_dependency import (
    verify_token,
)

from shared_actions.services.authorization.board_authorization_service import (
    BoardAuthorizationService,
)
from shared_actions.operations.data_operation import clean_dict
from modules.card_module.card_model import (
    Card,
    AssignedCardListResponses,
    CardAggregation,
    CreateCardRequest,
    UpdateCardRequest,
    MoveCardRequest,
    UpdateAssignMemberRequest,
    UpdateWatchRequest,
    UpdateCardLabelRequest,
    AddCommentRequest,
    UpdateCardCommentRequest,
    AddAttachmentRequest,
    UpdateCardAttachmentRequest,
    AddChecklistRequest,
    UpdateCardChecklistRequest,
    AddChecklistItemRequest,
    UpdateCardChecklistItemRequest,
)
from modules.card_module.card_service import CardService

from modules.user_module.user_model import UserRole

card_router = APIRouter()
card_service = CardService()
board_authorization_service = BoardAuthorizationService()


@card_router.post("/")
def create_card(
    create_card_request: CreateCardRequest = Body(...),
    payload: dict = Depends(verify_token),
):
    data: dict = payload["data"]
    board_authorization_service.validate_update_board_request(
        ObjectId(data["user_id"]),
        ObjectId(create_card_request.board_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )
    card: Card = card_service.create_card(create_card_request)
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data=clean_dict(card.dict())
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.get("/assignedCard")
def get_assigned_card(payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    assigned_card_list: AssignedCardListResponses = card_service.get_assigned_card(
        ObjectId(data["user_id"])
    )
    message_list_response: MessageListResponse = MessageListResponse(
        success=True,
        status_code=status.HTTP_200_OK,
        data=clean_dict(assigned_card_list.dict()["card_list_response"]),
    )
    return JSONResponse(
        status_code=status.HTTP_200_OK, content=message_list_response.dict()
    )


@card_router.post("/moveCard")
def move_card(
    card_move_request: MoveCardRequest = Body(...),
    payload: dict = Depends(verify_token),
):
    data: dict = payload["data"]
    board_authorization_service.validate_update_board_request(
        ObjectId(data["user_id"]),
        ObjectId(card_move_request.old_board_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )
    board_authorization_service.validate_update_board_request(
        ObjectId(data["user_id"]),
        ObjectId(card_move_request.new_board_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )

    card_service.move_card(card_move_request)
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data={}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.put("/{card_id}/assignMember")
def update_assign_member(
    card_id: str,
    card_update_request: UpdateAssignMemberRequest = Body(...),
    payload: dict = Depends(verify_token),
):
    data: dict = payload["data"]
    board_authorization_service.validate_card_request(
        ObjectId(data["user_id"]),
        ObjectId(card_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )

    card_service.update_assigned_member(card_id, card_update_request)
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data={}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.put("/{card_id}/watch")
def update_watch(
    card_id: str,
    card_update_request: UpdateWatchRequest = Body(...),
    payload: dict = Depends(verify_token),
):
    data: dict = payload["data"]
    board_authorization_service.validate_card_request(
        ObjectId(data["user_id"]),
        ObjectId(card_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )

    card_service.update_watch(card_id, data["user_id"], card_update_request)
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data={}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.put("/{card_id}/cardLabel")
def update_card_label(
    card_id: str,
    card_update_request: UpdateCardLabelRequest = Body(...),
    payload: dict = Depends(verify_token),
):
    data: dict = payload["data"]
    board_authorization_service.validate_card_request(
        ObjectId(data["user_id"]),
        ObjectId(card_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )

    card_service.update_label(card_id, card_update_request)
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data={}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.post("/{card_id}/comment")
def add_comment(
    card_id: str,
    comment_add_request: AddCommentRequest = Body(...),
    payload: dict = Depends(verify_token),
):
    data: dict = payload["data"]
    board_authorization_service.validate_card_request(
        ObjectId(data["user_id"]),
        ObjectId(card_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )
    card_service.add_comment(card_id, comment_add_request)
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data={}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.put("/{card_id}/comment/{comment_id}")
def update_comment(
    card_id: str,
    comment_id: str,
    card_update_request: UpdateCardCommentRequest = Body(...),
    payload: dict = Depends(verify_token),
):
    data: dict = payload["data"]
    board_authorization_service.validate_card_request(
        ObjectId(data["user_id"]),
        ObjectId(card_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )

    card_service.update_comment(card_id, comment_id, card_update_request)
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data={}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.delete("/{card_id}/comment/{comment_id}")
def delete_comment(
    card_id: str,
    comment_id: str,
    payload: dict = Depends(verify_token),
):
    data: dict = payload["data"]
    board_authorization_service.validate_card_request(
        ObjectId(data["user_id"]),
        ObjectId(card_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )

    card_service.delete_comment(card_id, comment_id)
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data={}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.post("/{card_id}/attachment")
def add_attachment(
    card_id: str,
    comment_add_request: AddAttachmentRequest = Body(...),
    payload: dict = Depends(verify_token),
):
    data: dict = payload["data"]
    board_authorization_service.validate_card_request(
        ObjectId(data["user_id"]),
        ObjectId(card_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )
    card_service.add_attachment(card_id, comment_add_request)
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data={}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.put("/{card_id}/attachment/{attachment_id}")
def update_attachment(
    card_id: str,
    attachment_id: str,
    card_update_request: UpdateCardAttachmentRequest = Body(...),
    payload: dict = Depends(verify_token),
):
    data: dict = payload["data"]
    board_authorization_service.validate_card_request(
        ObjectId(data["user_id"]),
        ObjectId(card_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )

    card_service.update_attachment(card_id, attachment_id, card_update_request)
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data={}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.delete("/{card_id}/attachment/{attachment_id}")
def delete_attachment(
    card_id: str,
    attachment_id: str,
    payload: dict = Depends(verify_token),
):
    data: dict = payload["data"]
    board_authorization_service.validate_card_request(
        ObjectId(data["user_id"]),
        ObjectId(card_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )

    card_service.delete_attachment(card_id, attachment_id)
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data={}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.post("/{card_id}/checklist")
def add_checklist(
    card_id: str,
    checklist_add_request: AddChecklistRequest = Body(...),
    payload: dict = Depends(verify_token),
):
    data: dict = payload["data"]
    board_authorization_service.validate_card_request(
        ObjectId(data["user_id"]),
        ObjectId(card_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )
    card_service.add_checklist(card_id, checklist_add_request)
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data={}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.put("/{card_id}/checklist/{checklist_id}")
def update_checklist(
    card_id: str,
    checklist_id: str,
    card_update_request: UpdateCardChecklistRequest = Body(...),
    payload: dict = Depends(verify_token),
):
    data: dict = payload["data"]
    board_authorization_service.validate_card_request(
        ObjectId(data["user_id"]),
        ObjectId(card_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )

    card_service.update_checklist(card_id, checklist_id, card_update_request)
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data={}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.delete("/{card_id}/checklist/{checklist_id}")
def delete_checklist(
    card_id: str,
    checklist_id: str,
    payload: dict = Depends(verify_token),
):
    data: dict = payload["data"]
    board_authorization_service.validate_card_request(
        ObjectId(data["user_id"]),
        ObjectId(card_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )

    card_service.delete_checklist(card_id, checklist_id)
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data={}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.post("/{card_id}/checklist/{checklist_id}/checklistItem")
def add_checklist_item(
    card_id: str,
    checklist_id: str,
    checklist_item_add_request: AddChecklistItemRequest = Body(...),
    payload: dict = Depends(verify_token),
):
    data: dict = payload["data"]
    board_authorization_service.validate_card_request(
        ObjectId(data["user_id"]),
        ObjectId(card_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )
    card_service.add_checklist_item(card_id, checklist_id, checklist_item_add_request)
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data={}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.put(
    "/{card_id}/checklist/{checklist_id}/checklistItem/{checklist_item_id}"
)
def update_checklist_item(
    card_id: str,
    checklist_id: str,
    checklist_item_id: str,
    card_update_request: UpdateCardChecklistItemRequest = Body(...),
    payload: dict = Depends(verify_token),
):
    data: dict = payload["data"]
    board_authorization_service.validate_card_request(
        ObjectId(data["user_id"]),
        ObjectId(card_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )

    card_service.update_checklist_item(
        card_id, checklist_id, checklist_item_id, card_update_request
    )
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data={}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.delete(
    "/{card_id}/checklist/{checklist_id}/checklistItem/{checklist_item_id}"
)
def delete_checklist_item(
    card_id: str,
    checklist_id: str,
    checklist_item_id: str,
    payload: dict = Depends(verify_token),
):
    data: dict = payload["data"]
    board_authorization_service.validate_card_request(
        ObjectId(data["user_id"]),
        ObjectId(card_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )

    card_service.delete_checklist_item(card_id, checklist_id, checklist_item_id)
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data={}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.post(
    "/{card_id}/checklist/{checklist_id}/checklistItem/{checklist_item_id}/convertToCard"
)
def convert_to_card(
    card_id: str,
    checklist_id: str,
    checklist_item_id: str,
    create_card_request: CreateCardRequest = Body(...),
    payload: dict = Depends(verify_token),
):
    data: dict = payload["data"]
    board_authorization_service.validate_card_request(
        ObjectId(data["user_id"]),
        ObjectId(card_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )

    card_service.convert_to_card(
        card_id, checklist_id, checklist_item_id, create_card_request
    )
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data={}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.get("/{card_id}")
def get_card(card_id: str, payload: dict = Depends(verify_token)):
    card: CardAggregation = card_service.get_card(ObjectId(card_id))
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data=clean_dict(card.dict())
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.delete("/{card_id}")
def delete_card(card_id: str, payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    board_authorization_service.validate_card_request(
        ObjectId(data["user_id"]),
        ObjectId(card_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )
    card_service.delete_card(ObjectId(card_id))
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data={}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())


@card_router.put("/{card_id}")
def update_card(
    card_id: str,
    card_update_request: UpdateCardRequest = Body(...),
    payload: dict = Depends(verify_token),
):
    data: dict = payload["data"]
    board_authorization_service.validate_card_request(
        ObjectId(data["user_id"]),
        ObjectId(card_id),
        [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER],
    )
    card: Card = card_service.update_card(ObjectId(card_id), card_update_request)
    message_response: MessageResponse = MessageResponse(
        success=True, status_code=status.HTTP_200_OK, data=clean_dict(card.dict())
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())
