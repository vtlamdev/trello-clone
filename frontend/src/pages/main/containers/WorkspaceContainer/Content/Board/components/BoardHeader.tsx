import IconButton from "@mui/material/IconButton";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import * as React from "react";
import BackgroundLetterAvatars from "../../../../../../../components/AvatarUser";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { BoardModal, VisibilityType } from "../BoardModal/BoardModal";
import { useEffect, useState } from "react";
import Menu from "@mui/material/Menu";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MoveToInboxOutlinedIcon from "@mui/icons-material/MoveToInboxOutlined";
import Snackbar from "@mui/material/Snackbar";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import CloseIcon from "@mui/icons-material/Close";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import Button from "@mui/material/Button";
import { ResponseData } from "../../../../../../../models/responseModel";
import { RequestData } from "../../../../../../../models/requestModel";
import APIClient from "../../../../../../../base/networking/APIClient";
import { BoardVisibility } from "../../../../../WorkspaceContex/WorkspaceModel";
import { useParams, useNavigate } from "react-router-dom";
import { MemberRoleType } from "../../../../../WorkspaceContex/WorkspaceModel";
import { RoleActionsModel } from "../BoardModal/RoleActionModel";
import BoardInviteModal from "../../../../../../../components/WorkspacePage/BoardInviteModal";
import {
  DecodeJWT,
  UserExpired,
} from "../../../../../../../base/helper/DecodeJWT";
import { useAllWorkspaceContext } from "../../../../../WorkspaceContex/WorkspaceContex";
export default function BoardHeader({
  board,
  wsBoard,
  userRole,
  roleAction,
  handleRefetchBoard,
}: {
  board: BoardModal | undefined;
  wsBoard: WebSocket | null;
  userRole: MemberRoleType;
  roleAction: RoleActionsModel;
  handleRefetchBoard: () => void;
}) {
  const [boardData, setBoardData] = useState<BoardModal | undefined>(board);
  const userToken = localStorage.getItem("AccessToken");
  const { boardId } = useParams();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [boardName, setBoardName] = useState<string | undefined>("");
  const [isClickArchive, setIsClickArchive] = useState<boolean>(false);
  const [isClickArchiveList, setIsClickArchiveList] = useState<boolean>(true);
  const [isOpenChangeBoardName, setIsOpenChangeBoardName] =
    useState<boolean>(false);
  const [errorCode, setErrorCode] = useState<number>();
  const {fetchData} =useAllWorkspaceContext()

  const userInfor = DecodeJWT();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  useEffect(() => {
    setBoardData(board);
  }, [board]);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const [anchorChangeVisibility, setAnchorChangeVisibility] =
    useState<null | HTMLElement>(null);
  const openChangeVisibility = Boolean(anchorChangeVisibility);
  const handleClickChangeVisibility = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorChangeVisibility(event.currentTarget);
  };
  const handleCloseChangeVisibility = () => {
    setAnchorChangeVisibility(null);
  };

  const [openSnackbar, setOpenSnackbar] = useState(false);
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

  const apiClient: APIClient = new APIClient();
  async function handleClickStart() {
    try {
      if (userToken) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData =
            await apiClient.putAuthenticatedData(
              `/board/starBoard`,
              {} as RequestData,
              {
                board_id: board?.board_id,
              },
              userToken
            );
          if (responseData.success) {
            handleRefetchBoard();
            fetchData()
            wsBoard?.send("update board");
          }
          setIsOpenChangeBoardName(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  async function handleClickChangeBoardName(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    try {
      if (userToken && board) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          if (
            roleAction[userRole].boardPermissions[board.visibility].edit ===
            true
          ) {
            const responseData: ResponseData =
              await apiClient.putAuthenticatedData(
                `/board/updateBoard`,
                {} as RequestData,
                {
                  board_id: board?.board_id,
                  title: boardName,
                },
                userToken
              );
            if (responseData.success) {
              handleRefetchBoard();
              fetchData()
              wsBoard?.send("update board");
            }
          } else {
            setErrorCode(403);
            handleClickSnackBar();
          }

          setIsOpenChangeBoardName(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  async function handleChangeVisibility(typeVisibility: string) {
    try {
      if (userToken && board) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          if (
            roleAction[userRole].changeBoardVisibility ===
            true
          ) {
            const responseData: ResponseData =
              await apiClient.putAuthenticatedData(
                `/board/changeVisibility`,
                {} as RequestData,
                {
                  board_id: boardId,
                  visibility: typeVisibility,
                },
                userToken
              );
            if (responseData.success) {
              handleRefetchBoard();
              wsBoard?.send("update board");
            } else {
              setErrorCode(responseData.status_code);
              handleClickSnackBar();
            }
          } else {
            setErrorCode(403);
            handleClickSnackBar();
          }

          handleCloseChangeVisibility();
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  async function handleUnArchivedList(list_id: string) {
    try {
      if (userToken && board) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          if (
            roleAction[userRole].boardPermissions[board.visibility].edit ===
            true
          ) {
            const responseData: ResponseData =
              await apiClient.putAuthenticatedData(
                `/board/unarchiveList`,
                {} as RequestData,
                {
                  board_id: boardId,
                  list_id: list_id,
                },
                userToken
              );
            if (responseData.success) {
              handleRefetchBoard();
              wsBoard?.send("update board");
            }
          } else {
            setErrorCode(403);
            handleClickSnackBar();
          }
        }
      }
    } catch (err: any) {
      console.log(err);
    }
  }

  async function handleUnArchivedCard(card_id: string) {
    try {
      if (userToken && board) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          if (
            roleAction[userRole].boardPermissions[board.visibility].edit ===
            true
          ) {
            const responseData: ResponseData =
              await apiClient.putAuthenticatedData(
                `/card/${card_id}`,
                {} as RequestData,
                {
                  is_archived: false,
                },
                userToken
              );
            if (responseData.success) {
              handleRefetchBoard();
              wsBoard?.send("update board");
            }
          } else {
            setErrorCode(403);
            handleClickSnackBar();
          }
        }
      }
    } catch (err: any) {
      console.log(err);
    }
  }
  async function handleDeleteCard(card_id: string) {
    try {
      if (userToken && board) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          if (
            roleAction[userRole].boardPermissions[board.visibility].edit ===
            true
          ) {
            const responseData: ResponseData = await apiClient.deleteAuthenticatedData(`/card/${card_id}`, {} as RequestData, userToken);
            if (responseData.success) {
              handleRefetchBoard();
              wsBoard?.send("update board");
            } 
          } else {
            setErrorCode(403);
            handleClickSnackBar();
          }
        }
      }
    } catch (err: any) {
      console.log(err);
    }
  }

  return (
    <div className="flex flex-row justify-between items-center p-3 bg-indigo-600 bg-opacity-50 text-white w-[100%] overflow-hidden">
      <div className="flex flex-row justify-around gap-8 items-center">
        {isOpenChangeBoardName ? (
          <div>
            <form onSubmit={handleClickChangeBoardName}>
              <FormControl>
                <Input
                  placeholder="Enter board name..."
                  value={boardName}
                  onChange={(e) => {
                    setBoardName(e.target.value);
                  }}
                  required
                />
              </FormControl>
            </form>
          </div>
        ) : (
          <h3
            className="text-xl font-bold cursor-pointer"
            onClick={() => {
              setIsOpenChangeBoardName(true);
              setBoardName(board?.title);
            }}
          >
            {boardData?.title}
          </h3>
        )}

        <IconButton onClick={handleClickStart}>
          <StarBorderOutlinedIcon
            fontSize="small"
            sx={
              board?.star.includes(userInfor.data.user_id)
                ? { color: "yellow" }
                : undefined
            }
          />
        </IconButton>
        <IconButton
          sx={{ borderRadius: 1 }}
          aria-label="more"
          id="long-button"
          aria-controls={openChangeVisibility ? "long-menu" : undefined}
          aria-expanded={openChangeVisibility ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClickChangeVisibility}
        >
          {boardData?.visibility === VisibilityType.PUBLIC ? (
            <PublicOutlinedIcon fontSize="small" />
          ) : boardData?.visibility === VisibilityType.WORKSPACE ? (
            <PeopleOutlineIcon fontSize="small" />
          ) : (
            <LockOutlinedIcon fontSize="small" />
          )}
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorChangeVisibility}
          open={openChangeVisibility}
          onClose={handleCloseChangeVisibility}
          PaperProps={{
            style: {
              maxHeight: 500,
              width: 300,
            },
          }}
        >
          <div>
            <div className="flex flex-row justify-between">
              <p>Change visibility</p>
              <IconButton onClick={handleCloseChangeVisibility}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
            <ListItemButton
              sx={{ pl: 4, py: 0, my: 2 }}
              onClick={() => {
                handleChangeVisibility(BoardVisibility.PUBLIC);
              }}
            >
              <ListItemIcon>
                <PublicOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="PUBLIC"
                sx={{
                  ".MuiListItemText-primary": {
                    fontSize: "14px",
                  },
                }}
              />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4, py: 0, my: 2 }}
              onClick={() => {
                handleChangeVisibility(BoardVisibility.WORKSPACE);
              }}
            >
              <ListItemIcon>
                <PeopleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="WORKSPACE"
                sx={{
                  ".MuiListItemText-primary": {
                    fontSize: "14px",
                  },
                }}
              />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4, py: 0, my: 2 }}
              onClick={() => {
                handleChangeVisibility(BoardVisibility.PRIVATE);
              }}
            >
              <ListItemIcon>
                <LockOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="PRIVATE"
                sx={{
                  ".MuiListItemText-primary": {
                    fontSize: "14px",
                  },
                }}
              />
            </ListItemButton>
          </div>
        </Menu>
      </div>
      <div className="flex flex-row justify-center items-center gap-8">
        {board !== undefined &&
          board?.members &&
          board?.members.map((member) => (
            <BackgroundLetterAvatars
              name={member.username}
              key={member.user_id}
            />
          ))}
        <div>
        <BoardInviteModal handleRefetchBoard={handleRefetchBoard} wsBoard={wsBoard} board={board} userRole={userRole} roleAction={roleAction} />

          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreHorizOutlinedIcon fontSize="small" />
          </IconButton>

          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 400,
                width: 300,
              },
            }}
          >
            <div className={isClickArchive ? "block " : "hidden"}>
              <div className="flex flex-row justify-between items-center mb-2 overflow-y-hidden">
                <IconButton
                  onClick={() => {
                    setIsClickArchive(false);
                  }}
                >
                  <ArrowBackIosNewOutlinedIcon />
                </IconButton>
                <h3>Archive</h3>
                <IconButton onClick={handleClose}>
                  <CloseOutlinedIcon />
                </IconButton>
              </div>

              <div className="flex flex-row justify-between items-center gap-2 overflow-y-hidden">
                <Input placeholder="Enter title" />
                <Button
                  sx={{ fontSize: "10px", p: 0 }}
                  onClick={() => {
                    setIsClickArchiveList((previous) => !previous);
                  }}
                >
                  {isClickArchiveList ? "Switch to card" : "Switch to list"}
                </Button>
              </div>
              <div className=" overflow-y-auto">
                {isClickArchiveList
                  ? board?.lists
                      .filter((list) => list.is_archived === true)
                      .map((list) => (
                        <div
                          key={list.list_id}
                          className="flex flex-row my-2 justify-between items-center gap-2  border-t-[1px] p-2"
                        >
                          <p className="text-sm">{list.title}</p>
                          <Button
                            sx={{ fontSize: "10px" }}
                            onClick={() => {
                              handleUnArchivedList(list.list_id);
                            }}
                          >
                            Send back to board
                          </Button>
                        </div>
                      ))
                  : board?.lists.map((list) =>
                      list.cards
                        .filter((card) => card.is_archived === true)
                        .map((card) => (
                          <div
                            key={card.card_id}
                            className="flex flex-row my-2 justify-between items-center gap-1  border-t-[1px] p-2"
                          >
                            <p className="text-sm">{card.name}</p>

                            <Button
                              sx={{ fontSize: "10px" }}
                              onClick={() => {
                                handleUnArchivedCard(card.card_id);
                              }}
                            >
                              Send back to board
                            </Button>
                            <Button
                              sx={{ fontSize: "10px" }}
                              onClick={() => {
                                handleDeleteCard(card.card_id);
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        ))
                    )}
              </div>
            </div>
            <div className={isClickArchive ? "hidden" : "block"}>
              <ListItemButton
                sx={{ pl: 4, py: 0, my: 2 }}
                onClick={() => {
                  setIsClickArchive(true);
                }}
              >
                <ListItemIcon>
                  <MoveToInboxOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Archived items"
                  sx={{
                    ".MuiListItemText-primary": {
                      fontSize: "14px",
                    },
                  }}
                />
              </ListItemButton>
             
            </div>
          </Menu>
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackBar}
        message={
          errorCode === 200
            ? "Change visibility successfully"
            : errorCode === 403
            ? "You can not change this board"
            : ""
        }
        action={action}
      />
    </div>
  );
}
