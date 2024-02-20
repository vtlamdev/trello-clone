import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BoardModal, CardModal } from "../../BoardModal/BoardModal";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BackgroundLetterAvatars from "../../../../../../../../components/AvatarUser";
import React, { useEffect, useState } from "react";
import CardModals from "../../CardModal/CardModal";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import Input from "@mui/joy/Input";
import Button from "@mui/material/Button";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FormControl from "@mui/joy/FormControl";
import { ResponseData } from "../../../../../../../../models/responseModel";
import { RequestData } from "../../../../../../../../models/requestModel";
import APIClient from "../../../../../../../../base/networking/APIClient";
import { useParams } from "react-router-dom";
import {
  DecodeJWT,
  UserExpired,
} from "../../../../../../../../base/helper/DecodeJWT";
import { useNavigate } from "react-router-dom";
import { MemberRoleType } from "../../../../../../WorkspaceContex/WorkspaceModel";
import { RoleActionsModel } from "../../BoardModal/RoleActionModel";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
export function Item({
  card,
  userRole,
  roleAction,
  board,
  wsBoard,
  getBoard,
}: {
  card: CardModal;
  board: BoardModal;
  userRole: MemberRoleType;
  roleAction: RoleActionsModel;
  wsBoard: WebSocket | null;
  getBoard: () => void;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openSetCardName, setOpenSetCardName] = useState<boolean>(false);
  const [cardName, setCardName] = useState<string>();
  const apiClient: APIClient = new APIClient();
  const userToken = localStorage.getItem("AccessToken");
  const userInfor = DecodeJWT();
  const {workspaceId, boardId} = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  useEffect(()=>{
    setCardName(card.name)
  },[card])
  const handleClickSnackBar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackBar = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackBar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  const handleCloseModal = () => {
    setOpenModal(false);
    window.history.replaceState(null, "", `/page/workspace/${workspaceId}/board/${boardId}`)
  };
  const handleOpenModal = ()=>{
    setOpenModal(true);
    window.history.replaceState(null, "", `/page/workspace/${workspaceId}/board/${boardId}/card/${card.card_id}`)
  }
  async function handleUpdateCardName(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (userToken) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          if (
            roleAction[userRole].boardPermissions[board.visibility].edit ===
            true
          ) {
            const responseData: ResponseData =
              await apiClient.putAuthenticatedData(
                `/card/${card.card_id}`,
                {} as RequestData,
                {
                  name: cardName,
                },
                userToken
              );
            setOpenSetCardName(false);

            if (responseData.success) {
                          // handleReFetchData();
              wsBoard?.send("update board");
          
              console.log("success");
            }
          } else {
            setMessage("you can not change this board");
 
            handleClickSnackBar();
          }
          setOpenSetCardName(false);
          setCardName(card.name)
        }
      }
    } catch (err: any) {
      console.log(err);
    }
  }
  return (
    <div>
      <div
        className="p-2 rounded-xl flex flex-col gap-4 bg-white my-2 border hover:border-green-300 relative"
        onClick={handleOpenModal}
      >
        <div className="grid grid-cols-5 grid-flow-row gap-2">
          {card.label.length > 0
            ? card.label.map((value, index) => (
                <Tooltip
                  title={`Color:${value.value}, title: ${value.title}`}
                  key={value.label_id || index}
                >
                  <div
                    className={`w-full h-2 bg-[${value.value}] rounded-sm`}
                  ></div>
                </Tooltip>
              ))
            : null}
        </div>
        {openSetCardName ? (
          <div>
            <form onSubmit={handleUpdateCardName}>
              <FormControl>
                <Input
                  placeholder="Enter a title for this card..."
                  value={cardName}
                  onChange={(e) => {
                    setCardName(e.target.value);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  required
                />
              </FormControl>
              <div className="flex flex-row gap-2 md:gap-20 mt-2">
                <Button
                  type="submit"
                  sx={{
                    background: "#0c66e4",
                    color: "white",
                    ":hover": { background: "#0055CC" },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Save
                </Button>
                <IconButton
                  sx={{ padding: 0 }}
                  onClick={(e) => {
                    setOpenSetCardName(false);
                    setCardName(card.name);
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <CloseOutlinedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-row justify-between">
            <p>{card.name}</p>
            <IconButton
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setOpenSetCardName(true);
              }}
            >
              <ModeEditOutlinedIcon fontSize="small" />
            </IconButton>
          </div>
        )}

        <div className="flex flex-row justify-between items-center gap-2">
          {card.watch.includes(userInfor.data.user_id) ? (
            <Tooltip title={"You are watching this card"}>
              <IconButton
                sx={{ padding: 0 }}
                onClick={handleOpenModal}
              >
                <VisibilityOutlinedIcon sx={{ fontSize: 12 }} />
              </IconButton>
            </Tooltip>
          ) : null}
          {card.due_date ? (
            <Tooltip title={"This card is due later"}>
              <IconButton
                sx={{ padding: 0 }}
                onClick={handleOpenModal}
              >
                <AccessTimeIcon sx={{ fontSize: 12 }} />
                <span className="text-[12px]">{card.due_date}</span>
              </IconButton>
            </Tooltip>
          ) : null}
          {card.attachment.length > 0 ? (
            <Tooltip title={"Attachments"}>
              <IconButton
                sx={{ padding: 0 }}
                onClick={handleOpenModal}
              >
                <AttachFileIcon sx={{ fontSize: 12 }} />
                <span className="text-sm">{card.attachment.length}</span>
              </IconButton>
            </Tooltip>
          ) : null}
          {card.check_list.length > 0 ? (
            <Tooltip title={"Checklist Items"}>
              <IconButton
                sx={{ padding: 0 }}
                onClick={handleOpenModal}
              >
                <TaskAltOutlinedIcon sx={{ fontSize: 12 }} />
                <span className="text-sm">{card.check_list.length}</span>
              </IconButton>
            </Tooltip>
          ) : null}
          <div className="flex flex-row gap-1 ml-auto">
            {card.assign.length > 0
              ? card.assign.map((value) => {
                  const assignedMember = board.members.find(
                    (member) => member.user_id === value
                  );
                  if (assignedMember) {
                    return (
                      <BackgroundLetterAvatars
                        name={assignedMember.username}
                        key={assignedMember.user_id}
                      />
                    );
                  }
                  return null;
                })
              : null}
          </div>
        </div>
      </div>
      <CardModals
        card_id={card.card_id}
        openModal={openModal}
        handleOpenModal={handleOpenModal}
        handleCloseModal={handleCloseModal}
        board={board}
        wsBoard={wsBoard}
        getBoard={getBoard}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackBar}
        message={message}
        action={action}
      />
    </div>
  );
}

export default function Card({
  card,
  userRole,
  roleAction,
  board,
  wsBoard,
  getBoard,
}: {
  card: CardModal;

  board: BoardModal;
  wsBoard: WebSocket | null;
  userRole: MemberRoleType;
  roleAction: RoleActionsModel;
  getBoard: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.card_id, data: { ...card } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item
        card={card}
        userRole={userRole}
        roleAction={roleAction}
        board={board}
        wsBoard={wsBoard}
        getBoard={getBoard}
      />
    </div>
  );
}
