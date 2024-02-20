import React, { useState } from "react";
import { Avatar, Box, Button, Grid, IconButton, MenuItem, Popover, Select, SelectChangeEvent, Typography } from "@mui/material";
import { BoardModel, MemberRoleType, MembersModel, User } from "../../../../../WorkspaceContex/WorkspaceModel";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Link, useNavigate } from "react-router-dom";

const MemberItem: React.FC<{
  memberItem: MembersModel;
  boardJoined: BoardModel[];
  userInfo: User;
  userRole: string;
  workspaceId: string;
  handleUpdateRole: (updateBody: MembersModel) => Promise<boolean | undefined>;
  handleRemoveMember: (updateBody: MembersModel) => Promise<boolean | undefined>;
}> = ({ memberItem, boardJoined, userInfo, userRole, handleUpdateRole, handleRemoveMember, workspaceId }) => {
  const [memberRole, setMemberRole] = useState<string>(memberItem.role);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handlePopClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopClose = () => {
    setAnchorEl(null);
  };

  const handleRoleChange = async (e: SelectChangeEvent) => {
    const updateBody: MembersModel = {
      user: {
        user_id: memberItem.user.user_id,
        username: memberItem.user.username,
        email: memberItem.user.email,
      },
      role: e.target.value as MemberRoleType,
    };
    const returnUpdate = await handleUpdateRole(updateBody);
    if (returnUpdate) setMemberRole(e.target.value);
    else {
    }
  };

  const handleUpdateMember = async () => {
    const updateBody: MembersModel = {
      user: {
        user_id: memberItem.user.user_id,
        username: memberItem.user.username,
        email: memberItem.user.email,
      },
      role: memberItem.role,
    };
    const returnUpdate = await handleRemoveMember(updateBody);
    if (returnUpdate) {
      if (memberItem.user.user_id == userInfo.user_id) {
        navigate("/page/home");
      }
    } else {
    }
  };

  const compareRole = (roleTarget: string) => {
    if (userRole == "OWNER") {
      return ["OWNER", "ADMIN", "MEMBER", "VIEWER"].includes(roleTarget);
    } else if (userRole == "ADMIN") {
      return ["ADMIN", "MEMBER", "VIEWER"].includes(roleTarget);
    } else if (userRole == "MEMBER") {
      return ["MEMBER", "VIEWER"].includes(roleTarget);
    } else return false;
  };

  return (
    <Grid container sx={{ flexDirection: "row" }}>
      <Grid container item xs={6} sx={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
        <Avatar sx={{ bgcolor: "#BEB6F2", width: 32, height: 32, fontSize: 12, fontWeight: 600 }}>{memberItem.user.username && memberItem.user.username[0].toUpperCase()}</Avatar>
        <Typography sx={{ marginLeft: 2 }}>{memberItem.user.username}</Typography>
      </Grid>
      <Grid container item xs={6} sx={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <Grid item xs={5} sx={{ padding: 0.5 }}>
          <Button aria-describedby={memberItem.user.user_id} size="small" variant="text" onClick={handlePopClick} sx={{ fontSize: 12, fontWeight: 600, textTransform: "none", width: "100%" }}>
            On {boardJoined.length} board
          </Button>
          <Popover
            id={memberItem.user.user_id}
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
            <Box sx={{ padding: 4, width: "350px", display: "flex", flexDirection: "column", gap: 2 }}>
              <Grid container sx={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <Grid item xs={1}></Grid>
                <Grid item xs={10}>
                  <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 600, textAlign: "center" }}>
                    Workspace boards
                  </Typography>
                </Grid>
                <Grid container item xs={1} sx={{ flexDirection: "row" }}>
                  <IconButton onClick={handlePopClose} sx={{ padding: 0 }}>
                    <CloseOutlinedIcon sx={{ width: 25, height: 25 }} />
                  </IconButton>
                </Grid>
              </Grid>

              <Typography sx={{ fontSize: "14px" }}>{memberItem.user.username} is a member of the following Workspace boards:</Typography>
              {boardJoined.map((boardItem) => (
                <Link key={boardItem.board_id} to={`/page/workspace/${workspaceId}/board/${boardItem.board_id}`}>
                  <Button sx={{ padding: 0, textTransform: "none", width: "100%", justifyContent: "left", color: "#000000" }}>
                    <Box sx={{ backgroundColor: "#BEB6F2", padding: 1, borderRadius: 2, width: 35, height: 35 }}></Box>
                    <Typography sx={{ fontSize: 14, marginLeft: 1 }}>{boardItem.title}</Typography>
                  </Button>
                </Link>
              ))}
            </Box>
          </Popover>
        </Grid>
        <Grid item xs={4} sx={{ padding: 0.5 }}>
          {userInfo.user_id == memberItem.user.user_id ? (
            <Select size="small" value={memberRole} onChange={handleRoleChange} sx={{ fontSize: 12, width: "100px" }}>
              {["OWNER"].includes(userRole) && (
                <MenuItem sx={{ fontSize: 14 }} value="OWNER">
                  OWNER
                </MenuItem>
              )}
              {["OWNER", "ADMIN"].includes(userRole) && (
                <MenuItem sx={{ fontSize: 14 }} value="ADMIN">
                  ADMIN
                </MenuItem>
              )}
              {["OWNER", "ADMIN", "MEMBER"].includes(userRole) && (
                <MenuItem sx={{ fontSize: 14 }} value="MEMBER">
                  MEMBER
                </MenuItem>
              )}
              {["OWNER", "ADMIN", "MEMBER"].includes(userRole) && (
                <MenuItem sx={{ fontSize: 14 }} value="VIEWER">
                  VIEWER
                </MenuItem>
              )}
            </Select>
          ) : (
            <Select size="small" value={memberRole} onChange={handleRoleChange} sx={{ fontSize: 12, width: "100px" }}>
              {compareRole(memberItem.role) && ["OWNER"].includes(userRole) && (
                <MenuItem sx={{ fontSize: 14 }} value="OWNER">
                  OWNER
                </MenuItem>
              )}
              {compareRole(memberItem.role) && ["OWNER", "ADMIN"].includes(userRole) && (
                <MenuItem sx={{ fontSize: 14 }} value="ADMIN">
                  ADMIN
                </MenuItem>
              )}
              {compareRole(memberItem.role) && ["OWNER", "ADMIN", "MEMBER"].includes(userRole) && (
                <MenuItem sx={{ fontSize: 14 }} value="MEMBER">
                  MEMBER
                </MenuItem>
              )}
              {compareRole(memberItem.role) && ["OWNER", "ADMIN", "MEMBER", "VIEWER"].includes(userRole) && (
                <MenuItem sx={{ fontSize: 14 }} value="VIEWER">
                  VIEWER
                </MenuItem>
              )}
              {!compareRole(memberItem.role) && (
                <MenuItem sx={{ fontSize: 14 }} value={memberRole}>
                  {memberRole}
                </MenuItem>
              )}
            </Select>
          )}
        </Grid>
        <Grid item xs={3} sx={{ padding: 0.5 }}>
          {userInfo.user_id == memberItem.user.user_id ? (
            <Button onClick={handleUpdateMember} size="small" variant="outlined" sx={{ fontSize: 12, fontWeight: 600, textTransform: "none", width: "100%" }}>
              Leave
            </Button>
          ) : compareRole(memberItem.role) ? (
            <Button onClick={handleUpdateMember} size="small" variant="outlined" sx={{ fontSize: 12, fontWeight: 600, textTransform: "none", width: "100%" }}>
              Remove
            </Button>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MemberItem;
