import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Grid, IconButton, Link, Modal, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import Members from "./ContentCard/MembersCard/MembersCard";
import Labels from "./ContentCard/LabelsCard/LabelsCard";
import NotificationsCard from "./ContentCard/NotificationsCard/NotificationsCard";
import DatesCard from "./ContentCard/DatesCard/DatesCard";
import DescriptionCard from "./ContentCard/DescriptionCard/DescriptionCard";
import AttachmentsCard from "./ContentCard/AttachmentsCard/AttachmentsCard";
import ChecklistCard from "./ContentCard/ChecklistCard/ChecklistCard";
import ActivityCard from "./ContentCard/ActivityCard/ActivityCard";
import MembersButton from "./AddToCard/MembersButton";
import LabelsButton from "./AddToCard/LabelsButton";
import ChecklistButton from "./AddToCard/ChecklistButton";
import DatesButton from "./AddToCard/DatesButton";
// import AttachmentButton from "./AddToCard/AttachmentButton";
// import MoveButton from "./Actions/MoveButton";
// import CopyButton from "./Actions/CopyButton";
import ArchiveButton from "./Actions/ArchiveButton";
// import ShareButton from "./Actions/ShareButton";
import CardModel from "./CardModel";

import APIClient from "../../../../../../../base/networking/APIClient";
import { ResponseData } from "../../../../../../../models/responseModel";
import { RequestData } from "../../../../../../../models/requestModel";
import { User } from "../../../../../WorkspaceContex/WorkspaceModel";
import { DecodeJWT, UserExpired } from "../../../../../../../base/helper/DecodeJWT";
import { BoardModal } from "../BoardModal/BoardModal";
import { WEB_SOCKET_URL } from "../../../../../../../base/config/constant";
import { useNavigate, useParams } from "react-router-dom";

const CardModal: React.FC<{ card_id: string; openModal: boolean; handleOpenModal: () => void; handleCloseModal: () => void; board: BoardModal; wsBoard: WebSocket | null; getBoard: () => void }> = ({
  card_id,
  openModal,
  handleOpenModal,
  handleCloseModal,
  board,

}) => {
  const [card, setCard] = useState<CardModel>({
    card_id: "",
    list: {
      list_id: "",
      title: "",
    },
    board: {
      board_id: "",
      title: "",
    },
    name: "",
    description: "",
    position: 0,
    assign: [],
    label: [],
    check_list: [],
    start_date: "",
    due_date: "",
    is_completed: false,
    is_archived: false,
    attachment: [],
    watch: [],
    comment: [],
    created_at: "",
    updated_at: "",
  });
  const [cardName, setCardName] = useState<string>("");
  const [editCardName, setEditCardName] = useState<boolean>(false);
  const [wsCard, setWsCard] = useState<WebSocket | null>(null);
  const { workspaceId, boardId, cardId } = useParams();
  const userInfo: User = DecodeJWT().data;
  const apiClient: APIClient = new APIClient();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    if (card_id == cardId) {
      handleOpenModal();
    }
    const ws = new WebSocket(`${WEB_SOCKET_URL}/board?board_id=${board.board_id}&client_id=${userInfo.user_id}`);
    ws.onopen = () => {
      setWsCard(ws);
    };
    ws.onmessage = function (event) {
      if (event.data == "update board") {
        fetchData();
      }
    };
    return () => {
      ws.close();
    };
  }, []);

  const handleOpenToChangeCardName = () => {
    setEditCardName((prev) => !prev);
    setCardName(card.name);
  };

  const handleCardNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCardName(e.target.value);
  };

  const handleWatchUpdate = async (watch: boolean) => {
    try {
      const requestBody = {
        is_watch: watch,
      };
      const token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.putAuthenticatedData(`/card/${card_id}/watch`, {} as RequestData, requestBody, token);
          if (responseData.success) {
            wsCard?.send("update board");
          } 
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error(error)
    }
  };

  const handleNameUpdate = async () => {
    try {
      const requestBody = {
        name: cardName,
      };
      const token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.putAuthenticatedData(`/card/${card_id}`, {} as RequestData, requestBody, token);
          if (responseData.success) {
            wsCard?.send("update board");
            setEditCardName((prev) => !prev);
          } else {
            setCardName(card.name);
            setEditCardName((prev) => !prev);
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      setEditCardName((prev) => !prev);
    }
  };

  const descriptionUpdate = async (description: string) => {
    try {
      const requestBody = {
        description: description,
      };
      const token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.putAuthenticatedData(`/card/${card_id}`, {} as RequestData, requestBody, token);
          if (responseData.success) {
            wsCard?.send("update board");
          } 
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.log(error)
    }
  };

  const checklistAdd = async (title: string) => {
    try {
      const requestBody = {
        title: title,
      };
      const token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.postAuthenticatedData(`/card/${card_id}/checklist`, {} as RequestData, requestBody, token);
          if (responseData.success) {
            wsCard?.send("update board");
            return true;
          } else {
            return false;
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      return false;
    }
  };

  const checklistUpdate = async (checklist_id: string, title: string) => {
    try {
      const requestBody = {
        title: title,
      };
      const token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.putAuthenticatedData(`/card/${card_id}/checklist/${checklist_id}`, {} as RequestData, requestBody, token);
          if (responseData.success) {
            wsCard?.send("update board");
            return true;
          } else {
            return false;
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      return false;
    }
  };

  const checklistDelete = async (checklist_id: string) => {
    try {
      const token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.deleteAuthenticatedData(`/card/${card_id}/checklist/${checklist_id}`, {} as RequestData, token);
          if (responseData.success) {
            wsCard?.send("update board");
            return true;
          } else {
            return false;
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      return false;
    }
  };

  const checklistItemAdd = async (checklist_id: string, name: string) => {
    try {
      const requestBody = {
        name: name,
      };
      const token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.postAuthenticatedData(`/card/${card_id}/checklist/${checklist_id}/checklistItem`, {} as RequestData, requestBody, token);
          if (responseData.success) {
            wsCard?.send("update board");
            return true;
          } else {
            return false;
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      return false;
    }
  };

  const checklistItemNameUpdate = async (checklist_id: string, checklist_item_id: string, name: string) => {
    try {
      const requestBody = {
        name: name,
      };
      const token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.putAuthenticatedData(
            `/card/${card_id}/checklist/${checklist_id}/checklistItem/${checklist_item_id}`,
            {} as RequestData,
            requestBody,
            token
          );
          if (responseData.success) {
            wsCard?.send("update board");
            return true;
          } else {
            return false;
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      return false;
    }
  };

  const checklistItemCheckValueUpdate = async (checklist_id: string, checklist_item_id: string, is_checked: boolean) => {
    try {
      const requestBody = {
        is_checked: is_checked,
      };
      const token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.putAuthenticatedData(
            `/card/${card_id}/checklist/${checklist_id}/checklistItem/${checklist_item_id}`,
            {} as RequestData,
            requestBody,
            token
          );
          if (responseData.success) {
            wsCard?.send("update board");
            return true;
          } else {
            return false;
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      return false;
    }
  };

  const checklistItemDelete = async (checklist_id: string, checklist_item_id: string) => {
    try {
      const token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.deleteAuthenticatedData(`/card/${card_id}/checklist/${checklist_id}/checklistItem/${checklist_item_id}`, {} as RequestData, token);
          if (responseData.success) {
            wsCard?.send("update board");
            return true;
          } else {
            return false;
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      return false;
    }
  };

  const convertToCard = async (checklist_id: string, checklist_item_id: string, name: string) => {
    const list = board.lists.filter((list_item) => list_item.list_id == card.list.list_id)[0];

    try {
      const requestBody = {
        board_id: card.board.board_id,
        list_id: card.list.list_id,
        name: name,
        position: list.cards.length > 0 ? list.cards[list.cards.length - 1]?.position + 1 : 1,
      };

      const token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.postAuthenticatedData(
            `/card/${card_id}/checklist/${checklist_id}/checklistItem/${checklist_item_id}/convertToCard`,
            {} as RequestData,
            requestBody,
            token
          );
          if (responseData.success) {
            wsCard?.send("update board");
            return true;
          } else {
            return false;
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      return false;
    }
  };

  const commentAdd = async (content: string) => {
    try {
      const requestBody = {
        user_id: userInfo.user_id,
        content: content,
      };
      const token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.postAuthenticatedData(`/card/${card_id}/comment`, {} as RequestData, requestBody, token);
          if (responseData.success) {
            wsCard?.send("update board");
            return true;
          } else {
            return false;
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      return false;
    }
  };

  const commentUpdate = async (comment_id: string, content: string) => {
    try {
      const requestBody = {
        content: content,
      };
      const token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.putAuthenticatedData(`/card/${card_id}/comment/${comment_id}`, {} as RequestData, requestBody, token);
          if (responseData.success) {
            wsCard?.send("update board");
            return true;
          } else {
            return false;
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      return false;
    }
  };

  const commentDelete = async (comment_id: string) => {
    try {
      const token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.deleteAuthenticatedData(`/card/${card_id}/comment/${comment_id}`, {} as RequestData, token);
          if (responseData.success) {
            wsCard?.send("update board");
            return true;
          } else {
            return false;
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      return false;
    }
  };

  const dateUpdate = async (start_date: string, due_date: string, is_completed: boolean) => {
    try {
      const requestBody = {
        start_date: start_date,
        due_date: due_date,
        is_completed: is_completed,
      };
      const token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.putAuthenticatedData(`/card/${card_id}`, {} as RequestData, requestBody, token);
          if (responseData.success) {
            wsCard?.send("update board");
            return true;
          } else {
            return false;
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      return false;
    }
  };

  const assginMember = async (member_id: string, is_assigned: boolean) => {
    try {
      const requestBody = {
        member_id: member_id,
        is_assigned: is_assigned,
      };
      const token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.putAuthenticatedData(`/card/${card_id}/assignMember`, {} as RequestData, requestBody, token);
          if (responseData.success) {
            wsCard?.send("update board");
            return true;
          } else {
            return false;
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      return false;
    }
  };

  const cardLabelUpdate = async (label_id: string, is_selected: boolean) => {
    try {
      const requestBody = {
        label_id: label_id,
        is_selected: is_selected,
      };
      const token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.putAuthenticatedData(`/card/${card_id}/cardLabel`, {} as RequestData, requestBody, token);
          if (responseData.success) {
            wsCard?.send("update board");
            return true;
          } else {
            return false;
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      return false;
    }
  };

  const archiveUpdate = async (is_archived: boolean) => {
    try {
      const requestBody = {
        is_archived: is_archived,
      };
      const token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          handleCloseModal();
          const responseData: ResponseData = await apiClient.putAuthenticatedData(`/card/${card_id}`, {} as RequestData, requestBody, token);
          if (responseData.success) {
            wsCard?.send("update board");
            return true;
          } else {
            return false;
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      return false;
    }
  };

  const deleteCard = async () => {
    try {
      const token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.deleteAuthenticatedData(`/card/${card_id}`, {} as RequestData, token);
          if (responseData.success) {
            wsCard?.send("update board");
            wsCard?.close();
            return true;
          } else {
            return false;
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      return false;
    }
  };

  const fetchData = async () => {
    const token = localStorage.getItem("AccessToken") || "";
    if (token) {
      if (!UserExpired()) {
        navigate("/login");
      } else {
        const responseData: ResponseData = await apiClient.getAuthenticatedData(`/card/${card_id}`, {} as RequestData, token);
        if (responseData.success) {
          setCard(() => ({ ...responseData.data }));
        } else {
          window.history.replaceState(null, "", `/page/workspace/${workspaceId}/board/${boardId}`);
        }
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <Modal open={openModal} onClose={handleCloseModal} sx={{ height: "100vh", overflow: "auto" }}>
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translate(-50%, -5%)",
          width: "80vw",
          maxWidth: "800px",
          backgroundColor: "whitesmoke",
          borderRadius: "10px",
          padding: 2,
        }}
      >
        <Grid container sx={{ flexDirection: "row" }}>
          <Grid container item xs={12} sx={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
            <Grid container item xs={12} sx={{ flexDirection: "row", alignItems: "center" }}>
              <Grid item xs={1}>
                <CreditCardIcon sx={{ width: 25, height: 25 }} />
              </Grid>
              <Grid container item xs={10}>
                {!editCardName ? (
                  <Grid item xs={12}>
                    <Button
                      onClick={handleOpenToChangeCardName}
                      sx={{ fontSize: 18, fontWeight: 600, height: 30, textTransform: "none", color: "black", width: "100%", padding: 0, justifyContent: "left" }}
                    >
                      {card?.name}
                    </Button>
                  </Grid>
                ) : (
                  <Grid container item xs={12} sx={{ flexDirection: "column", gap: 1 }}>
                    <Grid item>
                      <TextField size="small" onChange={handleCardNameChange} value={cardName} inputProps={{ style: { fontSize: 18, fontWeight: 600, height: 30, padding: 0 } }} fullWidth autoFocus />
                    </Grid>
                    <Grid container item sx={{ flexDirection: "row", gap: 1 }}>
                      <Button onClick={handleNameUpdate} size="small" variant="contained" sx={{ fontSize: 12, fontWeight: 600, textTransform: "none" }}>
                        Save
                      </Button>
                      <Button onClick={handleOpenToChangeCardName} size="small" variant="contained" sx={{ fontSize: 12, fontWeight: 600, textTransform: "none", backgroundColor: "grey" }}>
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Grid>
              <Grid container item xs={1} sx={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <IconButton onClick={handleCloseModal} sx={{ padding: 0 }}>
                  <CloseIcon sx={{ width: 25, height: 25 }} />
                </IconButton>
              </Grid>
            </Grid>

            <Grid container item xs={12} sx={{ flexDirection: "row", alignItems: "center", height: 30 }}>
              <Grid item xs={1}></Grid>
              <Grid item>
                <Typography sx={{ fontSize: 14 }}>
                  in list <Link component="button">{card?.list.title}</Link>
                </Typography>
              </Grid>
              <Grid item sx={{ marginLeft: 1 }}>
                {card?.watch.includes(userInfo.user_id) && <VisibilityOutlinedIcon sx={{ width: 15, height: 15 }} />}
              </Grid>
            </Grid>
          </Grid>

          <Grid container item xs={12} md={9} sx={{ flexDirection: "column", gap: 4 }}>
            <Grid container item sx={{ flexDirection: "row" }}>
              <Grid item xs={1}></Grid>
              <Grid container item xs={11} sx={{ flexDirection: "row", gap: 2 }}>
                {card.assign.length != 0 && <Members member={card.assign} />}
                {card.label.length != 0 && <Labels label={card.label} />}
                <NotificationsCard is_watch={card?.watch.includes(userInfo.user_id)} watchUpdate={handleWatchUpdate} />
                {(card.start_date != "" || card.due_date != "") && <DatesCard start_date={card.start_date} due_date={card.due_date} is_completed={card.is_completed} dateUpdate={dateUpdate} />}
              </Grid>
            </Grid>
            <DescriptionCard description_card={card.description} descriptionUpdate={descriptionUpdate} />
            {card.attachment.length != 0 && <AttachmentsCard attachment_card={card.attachment} />}
            {card.check_list.map((checkList_element) => (
              <ChecklistCard
                key={checkList_element.check_list_id}
                checkList_element={checkList_element}
                checklistUpdate={checklistUpdate}
                checklistDelete={checklistDelete}
                checklistItemAdd={checklistItemAdd}
                checklistItemNameUpdate={checklistItemNameUpdate}
                checklistItemCheckValueUpdate={checklistItemCheckValueUpdate}
                checklistItemDelete={checklistItemDelete}
                convertToCard={convertToCard}
              />
            ))}
            <ActivityCard comment={card.comment} commentAdd={commentAdd} commentUpdate={commentUpdate} commentDelete={commentDelete} />
          </Grid>

          <Grid container item xs={12} md={3} sx={{ flexDirection: "column", padding: 0.5, gap: 2 }}>
            <Grid container item sx={{ flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
              <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>Add to card</Typography>
              <MembersButton assign={card.assign} boardMember={board?.members} assginMember={assginMember} />
              <LabelsButton label_card={card.label} boardLabel={board?.labels} cardLabelUpdate={cardLabelUpdate} />
              <ChecklistButton checklistAdd={checklistAdd} />
              <DatesButton start_date={card.start_date} due_date={card.due_date} is_completed={card.is_completed} dateUpdate={dateUpdate} />

              {/* <AttachmentButton /> */}
            </Grid>

            <Grid container item sx={{ flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
              <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>Actions</Typography>
              {/* <MoveButton /> */}
              {/* <CopyButton /> */}
              <ArchiveButton isArchived={card.is_archived} archiveUpdate={archiveUpdate} deleteCard={deleteCard} />
              {/* <ShareButton /> */}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default CardModal;
