import Input from "@mui/joy/Input";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/joy/FormControl";
import Button from "@mui/material/Button";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import React, { useState } from "react";
import Card from "./Card/Card";
import { BoardModal, ListModal } from "../BoardModal/BoardModal";
import ListAction from "../../../../../../../components/ListAction";

import { useParams } from "react-router";
import APIClient from "../../../../../../../base/networking/APIClient";
import { RequestData } from "../../../../../../../models/requestModel";
import { ResponseData } from "../../../../../../../models/responseModel";
import { useNavigate } from "react-router-dom";
import { UserExpired } from "../../../../../../../base/helper/DecodeJWT";
import { RoleActionsModel } from "../BoardModal/RoleActionModel";
import { MemberRoleType } from "../../../../../WorkspaceContex/WorkspaceModel";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
export default function List({
  list,
  handleReFetchData,
  board,
  wsBoard,
  getBoard,
  roleAction,
  userRole,
}: {
  list: ListModal;
  handleReFetchData: () => void;
  board: BoardModal;
  wsBoard: WebSocket | null;
  getBoard: () => void;
  roleAction: RoleActionsModel;
  userRole: MemberRoleType;
}) {
  const [isAddACard, setIsAddACard] = useState<boolean>(false);
  const [isUpdateListTitle, setIsUpdateListTitle] = useState<boolean>(false);
  const [cardName, setCardName] = useState<string>("");
  const [listTitle, setListTitle] = useState<string>("");
  const { boardId } = useParams();
  const apiClient: APIClient = new APIClient();
  const userToken = localStorage.getItem("AccessToken");
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.list_id,
    data: { ...list },
    transition: {
      duration: 500,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: "100%",
    opacity: isDragging ? 0.5 : undefined,
  };
  async function handleCreateCard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
              await apiClient.postAuthenticatedData(
                `/card/createCard`,
                {} as RequestData,
                {
                  board_id: boardId,
                  list_id: list.list_id,
                  name: cardName,
                  position:
                    list.cards.length > 0
                      ? list.cards[list.cards.length - 1]?.position + 1
                      : 1,
                },
                userToken
              );
            if (responseData.success) {
              handleReFetchData();
              setIsAddACard(false);
              setCardName("");
              wsBoard?.send("update board");
            }
          } else {
            setMessage("You can not change this board");
            setIsAddACard(false);
            setCardName("");
            handleClickSnackBar();
          }
        }
      }
    } catch (err: any) {
      console.log(err);
    }
  }
  const handleUpdateListTitle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
                `/board/updateList`,
                {} as RequestData,
                {
                  board_id: boardId,
                  list_id: list.list_id,
                  title: listTitle,
                },
                userToken
              );
            if (responseData.success) {
              handleReFetchData();
              setIsUpdateListTitle(false);
              wsBoard?.send("update board");
            }
          } else {
            setMessage("You can not change this board");
            handleClickSnackBar();
            setIsUpdateListTitle(false);
          }
        }
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div style={style} {...attributes} ref={setNodeRef}>
      <div
        className="bg-[#ebecf0] w-[300px] mt-3 p-4 rounded-xl"
        {...listeners}
      >
        <div className="flex flex-row justify-between items-center">
          {isUpdateListTitle ? (
            <div>
              <form onSubmit={handleUpdateListTitle}>
                <FormControl>
                  <Input
                    placeholder="Enter a title for this card..."
                    value={listTitle}
                    onChange={(e) => {
                      setListTitle(e.target.value);
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
                      setIsUpdateListTitle(false);
                      setListTitle(list.title);
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
            <div className="flex flex-row justify-between items-center">
              <p
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setListTitle(list.title);
                  setIsUpdateListTitle(true);
                }}
              >
                {list.title}
              </p>
            </div>
          )}
          <ListAction
            list={list}
            board={board}
            wsBoard={wsBoard}
            roleAction={roleAction as RoleActionsModel}
            userRole={userRole as MemberRoleType}
            handleReFetchData={handleReFetchData}
          ></ListAction>
        </div>

        <SortableContext
          items={list.cards.map((value) => value.card_id)}
          strategy={verticalListSortingStrategy}
        >
          <div className=" overflow-y-auto max-h-[420px] min-h-[50px]">
            {/* ref={setNodeRef} style={containerStyle} */}
            {list.cards
              .filter((card) => card.is_archived !== true)
              .map((card) => (
                <Card
                  key={card.card_id}
                  userRole={userRole}
                  roleAction={roleAction}
                  card={card}
   
                  board={board}
                  wsBoard={wsBoard}
                  getBoard={getBoard}
                />
              ))}
          </div>
        </SortableContext>
        <div className={`${isAddACard ? "block" : "hidden"} md:mt-2 `}>
          <form onSubmit={handleCreateCard}>
            <FormControl>
              <Input
                placeholder="Enter a title for this card..."
                value={cardName}
                onChange={(e) => {
                  setCardName(e.target.value);
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
              >
                Save
              </Button>
              <IconButton
                sx={{ padding: 0 }}
                onClick={() => {
                  setIsAddACard(false);
                  setCardName('')
                }}
              >
                <CloseOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </div>
          </form>
        </div>
        <div className={`${isAddACard ? "hidden" : "block"}`}>
          <IconButton
            sx={{
              padding: 1,
              width: "100%",
              justifyContent: "start",
              borderRadius: "10px",
            }}
            onClick={() => {
              setIsAddACard(true);
            }}
          >
            <AddOutlinedIcon sx={{ fontSize: 18 }} />
            <span className="text-sm">Add a card</span>
          </IconButton>
        </div>
      </div>
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
