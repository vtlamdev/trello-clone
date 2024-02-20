import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { BoardModal, ListModal } from "../pages/main/containers/WorkspaceContainer/Content/Board/BoardModal/BoardModal";
import { useParams, useNavigate } from "react-router-dom";
import APIClient from "../base/networking/APIClient";
import { RequestData } from "../models/requestModel";
import { ResponseData } from "../models/responseModel";
import { UserExpired } from "../base/helper/DecodeJWT";
import { MemberRoleType } from "../pages/main/WorkspaceContex/WorkspaceModel";
import { RoleActionsModel } from "../pages/main/containers/WorkspaceContainer/Content/Board/BoardModal/RoleActionModel";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
export default function ListAction({
  list,
  board,
  userRole,
  roleAction,
  wsBoard,
  handleReFetchData,
}: {
  list: ListModal;
  board:BoardModal
  wsBoard: WebSocket | null;
  userRole: MemberRoleType;
  roleAction: RoleActionsModel;
  handleReFetchData: () => void;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isOpenCoppyList, setIsOpenCoppyList] = React.useState<boolean>(false);
  const [isMoveList, setIsMoveList] = React.useState<boolean>(false);
  const [isMoveAllCard, setIsMoveAllCard] = React.useState<boolean>(false);
  const [isAchiveAllCard, setIsAchiveAllCard] = React.useState<boolean>(false);
  const { boardId } = useParams();
  const apiClient: APIClient = new APIClient();
  const userToken = localStorage.getItem("AccessToken");
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const [message, setMessage] = React.useState<string>("");
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
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setIsOpenCoppyList(false);
    setIsMoveList(false);
    setIsMoveAllCard(false);
    setIsAchiveAllCard(false);
  };
  const handleArchiveList = async () => {
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
                `/board/archiveList`,
                {} as RequestData,
                {
                  board_id: boardId,
                  list_id: list.list_id,
                },
                userToken
              );
            if (responseData.success) {
              handleReFetchData();
              wsBoard?.send("update board");
            }
          } else {
            setMessage("You can not change this board");
            handleClickSnackBar()
          }

          handleClose();
        }
      }
    } catch (err: any) {
      console.log(err);
    }
  };
  return (
    <div>
      <div>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
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
              maxHeight: "500px",
              width: "300px",
              padding: "14px",
            },
          }}
        >
          <div
            className={`${
              (isOpenCoppyList ||
                isMoveList ||
                isMoveAllCard ||
                isAchiveAllCard) &&
              "hidden"
            }`}
          >
            <div className="flex flex-row">
              <div className="w-full font-bold text-sm text-center">
                List action
              </div>
              <IconButton sx={{ padding: 0 }} onClick={handleClose}>
                <CloseOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </div>
            <MenuItem onClick={handleArchiveList}>Archive this list</MenuItem>
          </div>
        </Menu>
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
