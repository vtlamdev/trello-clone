import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Divider, Grid, List, ListItem, TextField, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import WorkspaceTitle from "../../../../../../components/HomePage/WorkspaceTitle";
import WorkspaceBoardModal from "../../../../../../components/WorkspacePage/WorkspaceBoardModal";
import MemberItem from "./MemberItem/MemberItem";

import { WorkspaceDataModel, VisibilityType, MembersModel, User } from "../../../../WorkspaceContex/WorkspaceModel";
import { useAllWorkspaceContext } from "../../../../WorkspaceContex/WorkspaceContex";
import { DecodeJWT, UserExpired } from "../../../../../../base/helper/DecodeJWT";
import { ResponseData } from "../../../../../../models/responseModel";
import { RequestData } from "../../../../../../models/requestModel";
import APIClient from "../../../../../../base/networking/APIClient";

const WorkspaceMembers: React.FC = () => {
  const [members, setMembers] = useState<MembersModel[]>([]);
  const [filterValue, setFilterValue] = useState<string>("");
  const { allWorkspace, fetchData } = useAllWorkspaceContext();
  const { workspaceId } = useParams();
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
    setMembers(() => [...workspace.members]);
  }, [allWorkspace]);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };

  const handleFilterClear = () => {
    setFilterValue("");
  };

  const handleUpdateRole = async (updateBody: MembersModel) => {
    try {
      let requestBody = {
        workspace_id: workspace.workspace_id,
        user_id: updateBody.user.user_id,
        role: updateBody.role,
      };
      let token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.putAuthenticatedData(`/workspace/changeRole`, {} as RequestData, requestBody, token);
          if (responseData.success) {
            toast.success("Change role successful!");
            fetchData();
            return true;
          } else {
            toast.error("Change role failed!");
            fetchData();
            return false;
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      toast.error("Change role failed!");
      fetchData();
      return false;
    }
  };

  const handleRemoveMember = async (updateBody: MembersModel) => {
    try {
      let requestBody = {
        workspace_id: workspace.workspace_id,
        user_id: updateBody.user.user_id,
        role: updateBody.role,
      };
      let token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.putAuthenticatedData(`/workspace/removeMember`, {} as RequestData, requestBody, token);
          if (responseData.success) {
            toast.success("Update member successful!");
            fetchData();
            return true;
          } else {
            toast.error("Update member failed!");
            fetchData();
            return false;
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      toast.error("Update member failed!");
      fetchData();
      return false;
    }
  };

  const filterListBoardJoined = (member_id: string) => {
    const resultBoardList = workspace.boards.filter((boardItem) => boardItem.members.includes(member_id));
    return resultBoardList;
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
          <Grid item xs={10}>
            <Typography variant="h2" sx={{ fontWeight: 600, fontSize: 20, marginBottom: 2 }}>
              Members
            </Typography>
            <Typography sx={{ fontWeight: 600, fontSize: 18, marginBottom: 2 }}>Workspace members ({members.length})</Typography>
            <Typography sx={{ fontSize: 14, marginBottom: 1 }}>Workspace members can view visible boards and create new boards in the Workspace.</Typography>

            <Divider />

            {/* <Typography sx={{ fontWeight: 600, fontSize: 18, marginTop: 2, marginBottom: 2 }}>Invite members to join you</Typography>
            <Grid container>
              <Grid item md={7}>
                <Typography sx={{ fontSize: 14, marginBottom: 1 }}>
                  Anyone with an invite link can join this Workspace. You can also disable and create a new invite link for this Workspace at any time.
                </Typography>
              </Grid>
              <Grid container item xs={5} sx={{ flexDirection: "row", justifyContent: "flex-end", gap: 1 }}>
                <Button size="small" variant="text" sx={{ fontSize: 14, fontWeight: 600, textTransform: "none" }}>
                  Disable invite link
                </Button>
                <Button size="small" variant="text" sx={{ fontSize: 14, fontWeight: 600, textTransform: "none" }}>
                  Invite with link
                </Button>
              </Grid>
            </Grid>

            <Divider /> */}

            <TextField variant="outlined" size="small" value={filterValue} onChange={handleFilterChange} inputProps={{ style: { fontSize: 14 } }} placeholder="Filter by name" sx={{ margin: 1 }} />
            <Button onClick={handleFilterClear} size="small" variant="contained" sx={{ fontSize: 14, fontWeight: 600, textTransform: "none", margin: 1 }}>
              Clear Filter
            </Button>

            <Divider />

            <List>
              {members
                .filter((element) => element.user.username.includes(filterValue) || filterValue == "")
                .map((memberItem) => {
                  return (
                    <ListItem key={memberItem.user.user_id} sx={{ borderBottom: "1px solid lightgrey" }}>
                      <MemberItem
                        memberItem={memberItem}
                        boardJoined={filterListBoardJoined(memberItem.user.user_id)}
                        workspaceId={workspace.workspace_id}
                        userInfo={userInfo}
                        userRole={returnUserRole()}
                        handleUpdateRole={handleUpdateRole}
                        handleRemoveMember={handleRemoveMember}
                      />
                    </ListItem>
                  );
                })}
            </List>
          </Grid>
        </Grid>
      </div>
      <ToastContainer position="bottom-right" autoClose={1000} hideProgressBar={true} />
    </div>
  );
};

export default WorkspaceMembers;
