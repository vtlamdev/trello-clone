import { Box, Button, Divider, Grid, IconButton, Popover, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import React, { ChangeEvent, useEffect, useState } from "react";
import WorkspaceTitle from "../../../../../../components/HomePage/WorkspaceTitle";
import WorkspaceBoardModal from "../../../../../../components/WorkspacePage/WorkspaceBoardModal";
import { useAllWorkspaceContext } from "../../../../WorkspaceContex/WorkspaceContex";
import { useNavigate, useParams } from "react-router-dom";
import { User, VisibilityType, WorkspaceDataModel } from "../../../../WorkspaceContex/WorkspaceModel";
import { DecodeJWT, UserExpired } from "../../../../../../base/helper/DecodeJWT";
import APIClient from "../../../../../../base/networking/APIClient";
import { ResponseData } from "../../../../../../models/responseModel";
import { RequestData } from "../../../../../../models/requestModel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WorkspaceSettings: React.FC = () => {
  const [visibility, setVisibility] = useState<string>("");
  const [inputNameToDelete, setInputNameToDelete] = useState<string>("");
  const { allWorkspace, fetchData } = useAllWorkspaceContext();
  const { workspaceId } = useParams();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [anchorElDelete, setAnchorElDelte] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const openDelete = Boolean(anchorElDelete);
  const navigate = useNavigate();

  const userInfo: User = DecodeJWT().data;

  const workspace: WorkspaceDataModel = allWorkspace?.data.find((workspace) => workspace.workspace_id === workspaceId) || {
    workspace_id: "",
    name: "",
    description: "",
    visibility: "" as VisibilityType,
    invite_link: "",
    members: [],
    boards: [],
    is_deleted: false,
    created_at: "",
    updated_at: "",
  };

  const apiClient: APIClient = new APIClient();

  useEffect(() => {
    setVisibility(workspace.visibility);
  }, [allWorkspace]);

  const handlePopClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopClose = () => {
    setAnchorEl(null);
  };

  const handlePopDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElDelte(event.currentTarget);
  };

  const handlePopDeleteClose = () => {
    setInputNameToDelete("");
    setAnchorElDelte(null);
  };

  const handleInputNameToDeleteChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputNameToDelete(e.target.value);
  };

  const handleChangeVisibility = async (visibility: string) => {
    try {
      let requestBody = {
        workspace_id: workspace.workspace_id,
        visibility: visibility,
      };
      let token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.putAuthenticatedData(`/workspace/updateWorkspace`, {} as RequestData, requestBody, token);
          if (responseData.success) {
            toast.success("Change visibility successful!");
            fetchData();
            setVisibility(visibility);
          } else {
            toast.error("Change visibility failed!");
            fetchData();
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      toast.error("Change visibility failed!");
      fetchData();
    } finally {
      setInputNameToDelete("");
      setAnchorEl(null);
    }
  };

  const handleDeleteWorkspace = async () => {
    try {
      let token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.deleteAuthenticatedData(`/workspace/${workspace.workspace_id}`, {} as RequestData, token);
          if (responseData.success) {
            toast.success("Delete workspace successful!");
            fetchData();
            navigate("/page/home");
          } else {
            toast.error("Delete workspace failed!");
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      toast.error("Delete workspace failed!");
    } finally {
      setInputNameToDelete("");
      setAnchorElDelte(null);
    }
  };

  const returnUserRole = () => {
    const userRole = workspace.members.find((element) => element.user.user_id == userInfo.user_id);
    if (userRole) return userRole.role.toString();
    return "";
  };

  const reFetchData = () => {
    fetchData();
  };

  return (
    <div className="workspace-main w-full p-2">
      <div className="flex flex-row justify-between items-center md:mx-32">
        <WorkspaceTitle workspace={allWorkspace?.data.find((workspace) => workspace.workspace_id === workspaceId)} />
        <WorkspaceBoardModal reFetchData={reFetchData} />
      </div>

      <Divider sx={{ marginTop: 2 }} />

      <div className="workspace-content">
        <Grid container sx={{ flexDirection: "row", justifyContent: "center", padding: 2 }}>
          <Grid item md={10}>
            <Typography sx={{ fontWeight: 600, fontSize: 20, marginBottom: 2 }}>Workspace settings</Typography>
            <Typography sx={{ fontWeight: 600, fontSize: 18, marginBottom: 1 }}>Workspace visibility</Typography>

            <Divider />

            <Grid container sx={{ flexDirection: "row", alignItems: "center", marginTop: 1, marginBottom: 2 }}>
              <Grid item xs={10}>
                {visibility == "PRIVATE" ? (
                  <Typography sx={{ fontSize: 14, display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
                    <LockOutlinedIcon sx={{ width: 15, height: 15, color: "red" }} />
                    Private - This Workspace is private. It's not indexed or visible to those outside the Workspace.
                  </Typography>
                ) : (
                  <Typography sx={{ fontSize: 14, display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
                    <PublicOutlinedIcon sx={{ width: 15, height: 15, color: "green" }} />
                    Public - This Workspace is public. It's visible to anyone with the link. Only those invited to the Workspace can add and edit Workspace boards.
                  </Typography>
                )}
              </Grid>
              <Grid item xs={2}>
                {["OWNER", "ADMIN"].includes(returnUserRole()) && (
                  <Button aria-describedby="change-visibility" size="small" variant="contained" onClick={handlePopClick} sx={{ textTransform: "none" }}>
                    Change
                  </Button>
                )}
              </Grid>
              <Popover
                id="change-visibility"
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <Box sx={{ padding: 2, width: "350px" }}>
                  <Grid container sx={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={10}>
                      <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 600, textAlign: "center" }}>
                        Select Workspace visibility
                      </Typography>
                    </Grid>
                    <Grid container item xs={1} sx={{ flexDirection: "row" }}>
                      <IconButton onClick={handlePopClose} sx={{ padding: 0 }}>
                        <CloseOutlinedIcon sx={{ width: 25, height: 25 }} />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ flexDirection: "row" }}>
                    <Grid item>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => {
                          handleChangeVisibility("PRIVATE");
                        }}
                        sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", textTransform: "none", width: "100%", color: "#000000" }}
                      >
                        <LockOutlinedIcon sx={{ width: 15, height: 15, color: "red", marginRight: 1 }} />
                        Private
                        {visibility == "PRIVATE" && <CheckOutlinedIcon sx={{ width: 15, height: 15 }} />}
                      </Button>
                      <Typography sx={{ fontSize: "12px", fontWeight: 400 }}>This workspace is private. It's not indexed or visible to those outside the Workspace.</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => {
                        handleChangeVisibility("PUBLIC");
                      }}
                      sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", textTransform: "none", width: "100%", color: "#000000" }}
                    >
                      <PublicOutlinedIcon sx={{ width: 15, height: 15, color: "green", marginRight: 1 }} />
                      Public
                      {visibility == "PUBLIC" && <CheckOutlinedIcon sx={{ width: 25, height: 25 }} />}
                    </Button>
                    <Typography sx={{ fontSize: "12px", fontWeight: 400 }}>
                      This Workspace is public. It's visible to anyone with the link. Only those invited to the Workspace can add and edit Workspace boards.
                    </Typography>
                  </Grid>
                </Box>
              </Popover>
            </Grid>

            <Divider />

            <Grid item xs={12}>
              {["OWNER", "ADMIN"].includes(returnUserRole()) && (
                <Button aria-describedby="delete-workspace" size="small" variant="text" color="error" onClick={handlePopDeleteClick} sx={{ textTransform: "none" }}>
                  Delete this Workspace?
                </Button>
              )}
              <Popover
                id="delete-workspace"
                open={openDelete}
                anchorEl={anchorElDelete}
                onClose={handlePopDeleteClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <Box sx={{ padding: 2, width: "300px" }}>
                  <Grid container sx={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={10}>
                      <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 600, textAlign: "center" }}>
                        Delete Workspace?
                      </Typography>
                    </Grid>
                    <Grid container item xs={1} sx={{ flexDirection: "row" }}>
                      <IconButton onClick={handlePopDeleteClose} sx={{ padding: 0 }}>
                        <CloseOutlinedIcon sx={{ width: 25, height: 25 }} />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Enter "{workspace.name}" to delete:</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField size="small" value={inputNameToDelete} onChange={handleInputNameToDeleteChange} inputProps={{ style: { fontSize: 14 } }} sx={{ width: "100%" }} />
                    </Grid>
                    <Grid item xs={12}>
                      {inputNameToDelete == workspace.name ? (
                        <Button size="small" variant="contained" color="error" onClick={handleDeleteWorkspace} sx={{ textTransform: "none", fontWeight: 600, width: "100%" }}>
                          Delete Workspace
                        </Button>
                      ) : (
                        <Button size="small" variant="contained" color="error" disabled sx={{ textTransform: "none", fontWeight: 600, width: "100%" }}>
                          Delete Workspace
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </Popover>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <ToastContainer position="bottom-right" autoClose={1000} hideProgressBar={true} />
    </div>
  );
};

export default WorkspaceSettings;
