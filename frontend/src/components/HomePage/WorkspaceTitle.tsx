import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Textarea from "@mui/joy/Textarea";
import Input from "@mui/joy/Input";
import Button from "@mui/material/Button";
import { useState } from "react";
import {
  WorkspaceDataModel,
  VisibilityType,
} from "../../pages/main/WorkspaceContex/WorkspaceModel";
import { ResponseData } from "../../models/responseModel";
import { RequestData } from "../../models/requestModel";
import APIClient from "../../base/networking/APIClient";
import { useAllWorkspaceContext } from "../../pages/main/WorkspaceContex/WorkspaceContex";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import { UserExpired } from "../../base/helper/DecodeJWT";
export default function WorkspaceTitle({
  workspace,
}: {
  workspace: WorkspaceDataModel | undefined;
}) {
  const [openRenameForm, setOpenRenameForm] = useState<boolean>(false);
  const [workspaceName, setWorkspaceName] = useState<string | undefined>("");
  const [workspaceDescription, setWorkspaceDescription] = useState<
    string | undefined
  >("");
  const [loading, setLoading] = useState<boolean>(false);
  const UserToken = localStorage.getItem("AccessToken");
  const apiClient: APIClient = new APIClient();
  const { fetchData } = useAllWorkspaceContext();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [codeError, setCodeError] = useState<number>();
  const navigator = useNavigate();
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
  async function handleSubmitUpdateWorkspace(
    e: React.FormEvent<HTMLFormElement>
  ) {
    try {
      e.preventDefault();

      setLoading(true);
      if (UserToken) {
        if (!UserExpired()) {
          navigator("/login");
        } else {
          const responseData: ResponseData =
            await apiClient.putAuthenticatedData(
              `/workspace/updateWorkspace`,
              {} as RequestData,
              {
                workspace_id: workspace?.workspace_id,
                name: workspaceName,
                description: workspaceDescription,
              },
              UserToken
            );
          if (responseData.success) {
            fetchData();
            setWorkspaceName(workspaceName);
            setWorkspaceDescription(workspaceDescription);
          } else {
            setCodeError(responseData.status_code);
            handleClickSnackBar();
          }
          setOpenRenameForm(false);
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full">
      <div className={`${openRenameForm ? "hidden" : ""}`}>
        <div className="flex flex-row gap-2 items-center">
          <div>
            <div className="w-20 h-20 rounded-sm bg-blue-200 flex flex-col justify-center items-center">
              <h3 className="font-bold text-3xl">T</h3>
            </div>
          </div>

          <div className="flex flex-col gap-2  justify-center">
            <div className="flex flex-row gap-2 items-center ">
              <h3 className="font-bold text-2xl">{workspace?.name}</h3>
              <IconButton
                onClick={() => {
                  setWorkspaceDescription(workspace?.description);
                  setWorkspaceName(workspace?.name);
                  setOpenRenameForm(true);
                }}
              >
                <ModeEditOutlineOutlinedIcon fontSize="small" sx={{}} />
              </IconButton>
            </div>
            <div className="flex flex-row gap-2 items-center">
              {workspace?.visibility === VisibilityType.PUBLIC ? (
                <PublicOutlinedIcon fontSize="small" />
              ) : (
                <LockOutlinedIcon fontSize="small" />
              )}

              <p className="text-sm">{workspace?.visibility}</p>
            </div>
          </div>
        </div>
        <p className="text-sm">{workspace?.description}</p>
      </div>

      <div
        className={`md:w-[50%] w-full ${openRenameForm ? "block" : "hidden"}`}
      >
        <form
          onSubmit={handleSubmitUpdateWorkspace}
          className="flex flex-col gap-4"
        >
          <FormControl>
            <FormLabel>
              Name <span className="text-red-500">*</span>{" "}
            </FormLabel>
            <Input
              placeholder="Enter your workspace's name"
              defaultValue={workspace?.name}
              onChange={(e) => {
                setWorkspaceName(e.target.value);
              }}
              value={workspaceName}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>
              Description <span className="text-red-500">*</span>{" "}
            </FormLabel>
            <Textarea
              placeholder="Type here"
              defaultValue={workspace?.description}
              onChange={(e) => {
                setWorkspaceDescription(e.target.value);
              }}
              value={workspaceDescription}
              sx={{ mb: 1 }}
            />
          </FormControl>
          <div className="flex flex-row gap-2 md:gap-20">
            <Button
              type="submit"
              disabled={loading}
              sx={{
                background: "#0c66e4",
                color: "white",
                fontSize: "14px",
                fontWeight: "bold",
                "&:hover": { background: "#0055CC" },
              }}
            >
              Save
            </Button>
            <Button
              sx={{
                background: "#0c66e4",
                color: "white",
                fontSize: "14px",
                fontWeight: "bold",
                "&:hover": { background: "#0055CC" },
              }}
              onClick={() => {
                setOpenRenameForm(false);
              }}
            >
              Can
            </Button>
          </div>
        </form>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackBar}
        message={
          codeError === 403
            ? "You can not change this workspace"
            : "Change successfully"
        }
        action={action}
      />
    </div>
  );
}
