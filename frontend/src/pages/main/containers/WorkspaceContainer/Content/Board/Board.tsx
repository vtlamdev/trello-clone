import React, { useEffect, useState } from "react";
import BoardHeader from "./components/BoardHeader";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import AddIcon from "@mui/icons-material/Add";
import { ResponseData } from "../../../../../../models/responseModel";
import { RequestData } from "../../../../../../models/requestModel";
import APIClient from "../../../../../../base/networking/APIClient";
import IconButton from "@mui/material/IconButton";
import List from "./List/List";
import Card from "./List/Card/Card";
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import Button from "@mui/material/Button";
import { BoardModal, ListModal, CardModal } from "./BoardModal/BoardModal";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
enum ACTIVE_DRAG_TYPE {
  LIST = "LIST",
  CARD = "CARD",
}
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useParams } from "react-router";
import { WEB_SOCKET_URL } from "../../../../../../base/config/constant";
import {
  User,

  MemberRoleType,
  MembersModel,
} from "../../../../WorkspaceContex/WorkspaceModel";
import {
  DecodeJWT,
  UserExpired,
} from "../../../../../../base/helper/DecodeJWT";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RoleActionsModel } from "./BoardModal/RoleActionModel";
const Board: React.FC = () => {
  const [board, setBoard] = useState<BoardModal>();


  const [addList, isOpenAddList] = useState<boolean>(false);
  const [listName, setListName] = useState<string>("");
  const [activeDragType, setActiveDragType] = useState<ACTIVE_DRAG_TYPE | null>(
    null
  );


  const [activeDragData, setActiveDragData] = useState<
    ListModal | CardModal | null
  >(null);
  const [oldListWhenDragCard, setOldListWhenDragCard] = useState<
    ListModal | null | undefined
  >(null);
  const [cardWhenDragOver, setCardWhenDragOver] = useState<CardModal | null>(
    null
  );
  const [previousBoard, setPreviousBoard] = useState<BoardModal>();

  function SortListByPosition(BoardArgument: BoardModal) {
    BoardArgument.lists.sort((a, b) => a.position - b.position);
  }
  function SortCardByPosition(BoardArgument: BoardModal) {
    BoardArgument.lists.map((list) =>
      list.cards.sort((a, b) => a.position - b.position)
    );
  }

  const apiClient: APIClient = new APIClient();
  const userToken = localStorage.getItem("AccessToken");
  const { boardId, workspaceId } = useParams();
  const navigate = useNavigate();

  const userInfor: User = DecodeJWT().data;

  const [wsBoard, setWsBoard] = useState<WebSocket | null>(null);


  const [userRole, setUserRole] = useState<MemberRoleType>();
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
  async function getWorkspace() {
    try {
  
      if (userToken) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData =
            await apiClient.getAuthenticatedData(
              `/workspace/${workspaceId}`,
              {} as RequestData,
              userToken
            );

          if (responseData.success) {

            setUserRole(
              responseData.data.members.find(
                (member: MembersModel) =>
                  member.user.user_id === userInfor.user_id
              ).role
            );
          }
        }
      }
    } catch (err: any) {
      console.log(err);
    } 
  }

  async function getBoard() {
    try {
     
      if (userToken) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData =
            await apiClient.getAuthenticatedData(
              `/board/${boardId}`,
              {} as RequestData,
              userToken
            );

          if (responseData.success) {
            SortListByPosition(responseData.data);
            SortCardByPosition(responseData.data);
            setBoard(responseData.data);
            setPreviousBoard(responseData.data);
          }
        }
      }
    } catch (err: any) {
      console.log(err);
    } 
  }
  function handleReFetchData() {
    getBoard();
  }
  useEffect(() => {
    getBoard();
    getWorkspace();
    const ws = new WebSocket(`${WEB_SOCKET_URL}/board?board_id=${boardId}&client_id=${userInfor.user_id}`);
    ws.onopen = () => {
      setWsBoard(ws);
    };
    ws.onmessage = function (event) {
      if (event.data == "update board"){
        getBoard();
      }
    };
    return () => {
      ws.close();
    };
  }, [boardId, workspaceId]);
  const roleActions:RoleActionsModel = {
    OWNER: {
      createDeletePublicBoard: true,
      createDeleteWorkspaceBoard: true,
      createDeletePrivateBoard: true,
      changeWorkspaceVisibility: true,
      changeBoardVisibility: true,
      canAssignRoles:["OWNER","ADMIN","MEMBER","VIEWER"],
      boardPermissions: {
        PUBLIC: { view: true, edit: true },
        WORKSPACE: { view: true, edit: true },
        PRIVATE: { view: true, edit: board?.members.some(member=>member.user_id===userInfor.user_id) as boolean },
      },
    },
    ADMIN: {
      createDeletePublicBoard: true,
      createDeleteWorkspaceBoard: true,
      changeWorkspaceVisibility: true,
      changeBoardVisibility: true,
      createDeletePrivateBoard: false,
      canAssignRoles:["ADMIN","MEMBER","VIEWER"],
      boardPermissions: {
        PUBLIC: { view: true, edit: true },
        WORKSPACE: { view: true, edit: true },
        PRIVATE: { view: true, edit: board?.members.some(member=>member.user_id===userInfor.user_id) as boolean },
      },
    },
    MEMBER: {
      createDeletePublicBoard: true,
      changeBoardVisibility: false,
      createDeleteWorkspaceBoard: false,
      createDeletePrivateBoard: false,
      changeWorkspaceVisibility: false,
      canAssignRoles:["MEMBER","VIEWER"],
      boardPermissions: {
        PUBLIC: { view: true, edit: true },
        WORKSPACE: { view: true, edit: true },
        PRIVATE: { view: true, edit: board?.members.some(member=>member.user_id===userInfor.user_id) as boolean },
      },
    },
    VIEWER: {
      createDeletePublicBoard: false,
      createDeleteWorkspaceBoard: false,
      createDeletePrivateBoard: false,
      changeWorkspaceVisibility: false,
      changeBoardVisibility: false,
      canAssignRoles:[],
      boardPermissions: {
        PUBLIC: { view: true, edit: false },
        WORKSPACE: { view: true, edit: false },
        PRIVATE: { view: false, edit: false },
      },
    },
  };

  async function handleMoveCard(
    card_id: string,
    old_board_id: string,
    old_list_id: string,
    new_board_id: string,
    new_list_id: string,
    position: number
  ) {
    try {
      if (userToken && userRole && board) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          if (
            roleActions[userRole].boardPermissions[board.visibility].edit ===
            true
          ) {
            const responseData: ResponseData =
              await apiClient.postAuthenticatedData(
                `/card/moveCard`,
                {} as RequestData,
                {
                  card_id: card_id,
                  old_board_id: old_board_id,
                  old_list_id: old_list_id,
                  new_board_id: new_board_id,
                  new_list_id: new_list_id,
                  position: position,
                },
                userToken
              );
            if (responseData.success) {
              setPreviousBoard(board);
              wsBoard?.send("update board");
            } else {
              setBoard(previousBoard);
            }
          } else {
            setMessage("You can not change this board");
            handleClickSnackBar();
          }
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  }
  async function handleMoveList(
    board_id: string,
    list_id: string,
    position: number
  ) {
    try {
      if (userToken && userRole && board) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          if (
            roleActions[userRole].boardPermissions[board.visibility].edit ===
            true
          ) {
            const responseData: ResponseData =
              await apiClient.putAuthenticatedData(
                `/board/moveList`,
                {} as RequestData,
                {
                  board_id: board_id,
                  list_id: list_id,
                  position: position,
                },
                userToken
              );
            if (responseData.success) {
              setPreviousBoard(board);
              wsBoard?.send("update board");
            } else {
              setBoard(previousBoard);
            }
          } else {
            setMessage("You can not change this board");
            handleClickSnackBar();
          }
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  }
  async function handleAddList(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (userToken && board && userRole) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          if (
            roleActions[userRole].boardPermissions[board.visibility].edit ===
            true
          ) {
            const responseData: ResponseData =
              await apiClient.putAuthenticatedData(
                `/board/addList`,
                {} as RequestData,
                {
                  board_id: boardId,
                  title: listName,
                  position:
                    board.lists.sort((a, b) => b.position - a.position)[0]
                      .position + 1,
                },
                userToken
              );
            if (responseData.success) {
              handleReFetchData();
              setListName("");
              isOpenAddList(false);
              wsBoard?.send("update board");
            }
          } else {
            setMessage("You can not change this board");
            handleClickSnackBar();
          }
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    })
  );
  function findListByCardId(card_id: string) {
    return board?.lists.find((list) =>
      list.cards.some((card) => card.card_id === card_id)
    );
  }
  function handleDragStar(event: any) {
    const { active } = event;

    setActiveDragType(
      active?.data?.current?.list_id
        ? ACTIVE_DRAG_TYPE.LIST
        : ACTIVE_DRAG_TYPE.CARD
    );
 
    setActiveDragData(active?.data?.current);
    if (ACTIVE_DRAG_TYPE.CARD) {
      const list = findListByCardId(active.id);
      setOldListWhenDragCard(list);
    }
  }
  function handleDragOver(event: any) {
    if (
      userRole &&
      board &&
      roleActions[userRole].boardPermissions[board.visibility].edit === false
    ) {
      setMessage("You can not change this board");
      handleClickSnackBar();
    } else {
      const { active, over } = event;
      const activeList = findListByCardId(active.id);
      const overList = findListByCardId(over.id);
      if (!activeList || !overList) return;
      if (activeDragType === ACTIVE_DRAG_TYPE.CARD) {
        if (activeList && overList) {
          if (activeList) {
            const overCardIndex = overList?.cards?.findIndex(
              (value) => value.card_id === over.id
            );
            let newCardIndex = null;
            const isBellowOverItem =
              active.rect.current.translated &&
              active.rect.current.translated.top >
                over.rect.top + over.rect.height;
            const modifier = isBellowOverItem ? 1 : 0;
            newCardIndex =
              overCardIndex >= 0
                ? overCardIndex + modifier
                : overList?.cards?.length + 1;

            const nextList = board?.lists;
            if (nextList) {
              const nextActiveList = nextList.find(
                (list) => list.list_id === activeList.list_id
              );
              const nextOverList = nextList.find(
                (list) => list.list_id === overList.list_id
              );
              if (nextActiveList) {
                nextActiveList.cards = nextActiveList.cards.filter(
                  (value) => value.card_id !== active.id
                );
              }

              if (nextOverList) {
                nextOverList.cards = nextOverList.cards.filter(
                  (value) => value.card_id !== active.id
                );
                const newNextOverList = [...nextOverList.cards];
                newNextOverList.push(active.data.current);
                if (newCardIndex === 0) {
                  newNextOverList[newNextOverList.length - 1].position =
                    newNextOverList[newCardIndex].position - 0.5;
                } else if (newCardIndex === nextOverList.cards.length) {
                  newNextOverList[newNextOverList.length - 1].position =
                    newNextOverList[newCardIndex].position + 0.5;
                } else {
                  newNextOverList[newNextOverList.length - 1].position =
                    (newNextOverList[newCardIndex].position +
                      newNextOverList[newCardIndex - 1].position) /
                    2;
                }

                nextOverList.cards = newNextOverList;
                setCardWhenDragOver(
                  nextOverList.cards[nextOverList.cards.length - 1]
                );
                SortListByPosition(board);
                SortCardByPosition(board);
                setBoard(board);
              }
            }
          }
        }
      }
    }
  }
  function handleDragEnd(event: any) {
    if (
      userRole &&
      board &&
      roleActions[userRole].boardPermissions[board.visibility].edit === false
    ) {
      setMessage("You can not change this board");
      handleClickSnackBar();
    } else {
      const { active, over } = event;
      if (!over) return;
      if (
        activeDragType === ACTIVE_DRAG_TYPE.CARD &&
        over?.data.current.list_id
      ) {
        const oldList = findListByCardId(active.data.current.card_id);
        const nextList = board?.lists;
        if (nextList && oldList) {
          const nextOverList = nextList.find(
            (list) => list.list_id === over?.data.current.list_id
          );
          const nextActiveList = nextList.find(
            (list) => list.list_id === oldList.list_id
          );
          if (cardWhenDragOver && nextActiveList && nextOverList) {
            nextOverList.cards.push(cardWhenDragOver);
            nextActiveList.cards = nextActiveList.cards.filter(
              (card) => card.card_id !== active.data.current.card_id
            );
          }
          SortListByPosition(board);
          setBoard(board);
          setBoard(board);
        }
        if (boardId && cardWhenDragOver && oldListWhenDragCard) {
          handleMoveCard(
            cardWhenDragOver.card_id,
            boardId,
            oldListWhenDragCard.list_id,
            boardId,
            over?.data.current.list_id,
            1
          );
        }
      }
      if (activeDragType === ACTIVE_DRAG_TYPE.LIST) {
        const oldListIndex = board?.lists.findIndex(
          (value) => value.list_id === active.id
        );
        const newListIndex = board?.lists.findIndex(
          (value) => value.list_id === over.id
        );
        if (oldListIndex !== undefined && newListIndex !== undefined && board) {
          if (newListIndex === 0) {
            board.lists[oldListIndex].position =
              board.lists[newListIndex].position - 0.5;
          } else if (newListIndex === board.lists.length - 1) {
            board.lists[oldListIndex].position =
              board.lists[newListIndex].position + 0.5;
          } else {
            if (oldListIndex < newListIndex) {
              board.lists[oldListIndex].position =
                (board.lists[newListIndex].position +
                  board.lists[newListIndex + 1].position) /
                2;
            } else if (oldListIndex > newListIndex) {
              board.lists[oldListIndex].position =
                (board.lists[newListIndex].position +
                  board.lists[newListIndex - 1].position) /
                2;
            }
          }
          if (boardId) {
            handleMoveList(
              boardId,
              board.lists[oldListIndex].list_id,
              board.lists[oldListIndex].position
            );
          }
          SortListByPosition(board);
          setBoard(board);
        }
      }
      if (
        activeDragType === ACTIVE_DRAG_TYPE.CARD &&
        !over?.data.current.list_id
      ) {
        const activeList = findListByCardId(active.id);
        if (oldListWhenDragCard && activeList) {
          if (activeList.list_id !== oldListWhenDragCard.list_id) {
            if (cardWhenDragOver && boardId) {
              handleMoveCard(
                cardWhenDragOver.card_id,
                boardId,
                oldListWhenDragCard.list_id,
                boardId,
                activeList.list_id,
                cardWhenDragOver?.position
              );
            }
          } else if (activeList.list_id === oldListWhenDragCard.list_id) {
            const oldCardIndex = oldListWhenDragCard.cards.findIndex(
              (card) => card.card_id === active.id
            );
            const newCardIndex = oldListWhenDragCard.cards.findIndex(
              (card) => card.card_id === over.id
            );
            if (newCardIndex === 0) {
              oldListWhenDragCard.cards[oldCardIndex].position =
                oldListWhenDragCard.cards[newCardIndex].position - 0.5;
            } else if (newCardIndex === oldListWhenDragCard.cards.length - 1) {
              oldListWhenDragCard.cards[oldCardIndex].position =
                oldListWhenDragCard.cards[newCardIndex].position + 0.5;
            } else {
              if (oldCardIndex < newCardIndex) {
                oldListWhenDragCard.cards[oldCardIndex].position =
                  (oldListWhenDragCard.cards[newCardIndex].position +
                    oldListWhenDragCard.cards[newCardIndex + 1].position) /
                  2;
              } else if (oldCardIndex > newCardIndex) {
                oldListWhenDragCard.cards[oldCardIndex].position =
                  (oldListWhenDragCard.cards[newCardIndex].position +
                    oldListWhenDragCard.cards[newCardIndex - 1].position) /
                  2;
              }
            }
            const columnUpdate = board?.lists;
            const targetList = columnUpdate?.find(
              (value) => value.list_id === oldListWhenDragCard.list_id
            );
            if (targetList && board) {
              targetList.cards = oldListWhenDragCard.cards;
              SortCardByPosition(board);
              setBoard(board);
            }
            const cardMoved = oldListWhenDragCard.cards[oldCardIndex];
            if (boardId) {
              handleMoveCard(
                cardMoved.card_id,
                boardId,
                oldListWhenDragCard.list_id,
                boardId,
                oldListWhenDragCard.list_id,
                cardMoved.position
              );
            }
          }
        }
      }


      setActiveDragType(null);
      setActiveDragData(null);
      setOldListWhenDragCard(null);

    }
  }

  return (
    <div className="h-full">
      <BoardHeader board={board} wsBoard={wsBoard} roleAction={roleActions} userRole={userRole as MemberRoleType} handleRefetchBoard={handleReFetchData} />
      <Box sx={{ minWidth: "100%", height: "100%", overflowX: "auto" }}>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStar}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={
              board?.lists
                .filter((list) => list.is_archived !== true)
                .map((list) => list.list_id) || []
            }
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex flex-row gap-8">
              {board?.lists
                .filter((list) => list.is_archived !== true)
                .map((list) => (
                  <List
                    key={list.list_id}
                    list={list}
                    handleReFetchData={handleReFetchData}
                    board={board}
                    roleAction={roleActions}
                    userRole={userRole as MemberRoleType}
                    wsBoard={wsBoard}
                    getBoard={getBoard}
                  />
                ))}
              <div>
                <div className="bg-[#ebecf0] w-[300px] mt-3 p-4 rounded-xl">
                  {addList ? (
                    <form onSubmit={handleAddList}>
                      <FormControl>
                        <Input
                          placeholder="Enter a title ..."
                          value={listName}
                          onChange={(e) => {
                            setListName(e.target.value);
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
                            isOpenAddList(false);
                            setListName("");
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <CloseOutlinedIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </div>
                    </form>
                  ) : (
                    <IconButton
                      sx={{ padding: 1, borderRadius: 1, width: "100%" }}
                      onClick={() => {
                        isOpenAddList(true);
                      }}
                    >
                      <AddIcon fontSize="small" />
                      <span className="text-[16px]">Add another list</span>
                    </IconButton>
                  )}
                </div>
              </div>
            </div>
          </SortableContext>

          <DragOverlay
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: "0.5",
                  },
                },
              }),
            }}
          >
            {!activeDragType && null}
            {activeDragType === ACTIVE_DRAG_TYPE.CARD && activeDragData && (
              <Card
                card={activeDragData as CardModal}
              
                board={board as BoardModal}
                wsBoard={wsBoard}
                getBoard={getBoard}
                userRole={userRole as MemberRoleType}
                roleAction={roleActions}
              />
            )}
            {activeDragType === ACTIVE_DRAG_TYPE.LIST && activeDragData && (
              <List
                list={activeDragData as ListModal}
                handleReFetchData={() => {}}
                board={board as BoardModal}
                wsBoard={wsBoard}
                getBoard={getBoard}
                roleAction={roleActions}
                userRole={userRole as MemberRoleType}
              />
            )}
          </DragOverlay>
        </DndContext>
        {/* <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={false}
        >
          <CircularProgress color="inherit" />
        </Backdrop> */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={handleCloseSnackBar}
          message={message}
          action={action}
        />
      </Box>
    </div>
  );
};

export default Board;
