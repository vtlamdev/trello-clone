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

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface FunctionProps {
  reFetchData: ()=>void
}

export default function WorkspaceBoardModal({reFetchData}: FunctionProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [users, setUsers] = React.useState<SearchUsersModel | null>(null);
  const [keyword] = React.useState<string>("");
  const [inviteUserId, setInviteUserId] = React.useState<string>("");
  const userToken = localStorage.getItem("AccessToken");
  const apiClient: APIClient = new APIClient();
  const { workspaceId } = useParams();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [codeError, setCodeError]=React.useState<number>();
  const handleClickSnackBar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackBar = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
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
  async function handleClickInviteMember() {
    try {
      if (userToken) {
        const responseData: ResponseData = await apiClient.putAuthenticatedData(
          `/workspace/inviteMember`,
          {} as RequestData,
          {
            workspace_id: workspaceId,
            user_id: inviteUserId,
          },
          userToken
        );
        console.log(responseData)
        if (responseData.success) {
          setCodeError(200)
          handleClickSnackBar()
          reFetchData()
        }
        else if(responseData.status_code===400)
        {
          setCodeError(400)
          handleClickSnackBar()
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
        Invite Workspace Members
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
            Invite to Workspace
          </Typography>
          <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            options={
              users !== undefined && users !== null
                ? users.data.users.map((user) => user.email)
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
              handleClickInviteMember();
            }}
          >
            Invite
          </Button>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={5000}
            onClose={handleCloseSnackBar}
            message={codeError===200 ?"Member was invited":codeError===400?"Can not invite, member was invited before":""}
            action={action}
          />
        </Sheet>
      </Modal>
    </React.Fragment>
  );
}
