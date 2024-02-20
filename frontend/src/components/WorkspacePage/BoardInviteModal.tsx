import * as React from "react";
import Button from "@mui/joy/Button";
import Snackbar from "@mui/material/Snackbar";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { SearchUsersModel } from "./SearchModel";
import APIClient from "../../base/networking/APIClient";
import { RequestData } from "../../models/requestModel";
import { ResponseData } from "../../models/responseModel";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { BoardModal } from "../../pages/main/containers/WorkspaceContainer/Content/Board/BoardModal/BoardModal";
import { MemberRoleType } from "../../pages/main/WorkspaceContex/WorkspaceModel";
import { RoleActionsModel } from "../../pages/main/containers/WorkspaceContainer/Content/Board/BoardModal/RoleActionModel";
import { UserExpired } from "../../base/helper/DecodeJWT";
import { useAllWorkspaceContext } from "../../pages/main/WorkspaceContex/WorkspaceContex";
export default function BoardInviteModal({
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
  const [open, setOpen] = React.useState<boolean>(false);
  const [users, setUsers] = React.useState<SearchUsersModel | null>(null);
  const [keyword] = React.useState<string>("");
  const [inviteUserId, setInviteUserId] = React.useState<string>("");
  const userToken = localStorage.getItem("AccessToken");
  const apiClient: APIClient = new APIClient();
  const { workspaceId } = useParams();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [codeError, setCodeError] = React.useState<number>();
  const navigate = useNavigate();
  const { allWorkspace } = useAllWorkspaceContext();
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
  async function handleGetAllUser() {
    try {
      const responseData: ResponseData = await apiClient.getData(
        `/user/searchUsers?keyword=${keyword}`,
        {} as RequestData
      );
      if (responseData.success) {
        setUsers(responseData);
      }
    } catch (err) {
      console.error(err);
    }
  }
  async function handleAssignMember() {
    console.log(inviteUserId);
    try {
      if (userToken && board) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          if (
            roleAction[userRole].canAssignRoles.some(
              (assign) =>
                assign ===
                allWorkspace?.data
                  .find((workspace) => workspace.workspace_id === workspaceId)
                  ?.members.find(
                    (member) => member.user.user_id === inviteUserId
                  )?.role
            )
          ) {
            const responseData: ResponseData =
              await apiClient.putAuthenticatedData(
                `/board/assignMember`,
                {} as RequestData,
                {
                  board_id: board.board_id,
                  member_id: inviteUserId,
                },
                userToken
              );

            if (responseData.success) {
              handleRefetchBoard();
              setCodeError(200);
              handleClickSnackBar();
              wsBoard?.send("update board");
            }
          } else {
            setCodeError(400);
            handleClickSnackBar();
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  React.useEffect(() => {
    handleGetAllUser();
  }, []);
  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setOpen(true)}
        className="flex flex-row items-center gap-2"
      >
        <span>
          <PersonAddOutlinedIcon fontSize="small" />
        </span>
      </Button>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{
            minWidth: 800,
            maxWidth: 800,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            Invite to board
          </Typography>
          <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            options={
              allWorkspace !== null && allWorkspace !== undefined
                ? allWorkspace.data
                    .find((workspace) => workspace.workspace_id === workspaceId)
                    ?.members.map((member) => member.user.email) ?? []
                : []
            }
            onChange={(_event, value) => {
              if (value) {
                const getUserId = users?.data.users.find(
                  (user) => user.email === value
                );
                if (getUserId) {
                  setInviteUserId(getUserId.user_id);
                }
              } else {
                setInviteUserId("");
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search input"
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                }}
              />
            )}
          />
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            color="primary"
            onClick={() => {
              handleAssignMember();
            }}
          >
            Invite
          </Button>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={5000}
            onClose={handleCloseSnackBar}
            message={
              codeError === 200
                ? "Member was invited"
                : codeError === 400
                ? "You don't have permission"
                : ""
            }
            action={action}
          />
        </Sheet>
      </Modal>
    </React.Fragment>
  );
}
