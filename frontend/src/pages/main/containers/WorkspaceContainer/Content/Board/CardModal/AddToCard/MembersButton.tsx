import React, { ChangeEvent, useState } from "react";
import { Avatar, Box, Button, Grid, IconButton, Popover, TextField, Typography } from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { Assign } from "../CardModel";
import { UserModal } from "../../BoardModal/BoardModal";

const MembersButton: React.FC<{ assign: Assign[]; boardMember: UserModal[]; assginMember: (member_id: string, is_assigned: boolean) => Promise<boolean | undefined> }> = ({
  assign,
  boardMember,
  assginMember,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchMember, setSearchMember] = useState<string>("");

  const handlePopClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopClose = () => {
    setAnchorEl(null);
  };

  const handleSearchMember = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchMember(e.target.value);
  };

  const checkIncludeMember = (member_item: Assign) => {
    let assign_item: Assign;
    for (assign_item of assign) {
      if (assign_item.user_id == member_item.user_id) return true;
    }
    return false;
  };

  const handleAssignedMemberUpdate = async (member_id: string, is_assigned: boolean) => {
    const isAssignedMemberUpdate = await assginMember(member_id, is_assigned);
    if (isAssignedMemberUpdate) {
    } else {
    }
  };

  return (
    <>
      <Button
        aria-describedby="member_button"
        onClick={handlePopClick}
        sx={{ display: "flex", justifyContent: "flex-start", fontSize: 14, width: "100%", textTransform: "none", color: "black", backgroundColor: "#F0F0F0" }}
      >
        <PersonOutlineOutlinedIcon sx={{ width: 16, height: 16 }} />
        <Typography sx={{ fontSize: 14, marginLeft: 1 }}>Members</Typography>
      </Button>
      <Popover
        id="member_button"
        open={Boolean(anchorEl)}
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
        <Box sx={{ padding: 2, width: "300px" }}>
          <Grid container sx={{ flexDirection: "column", gap: 1 }}>
            <Grid container item sx={{ flexDirection: "row", alignItems: "center" }}>
              <Grid item xs={1}></Grid>
              <Grid item xs={10}>
                <Typography sx={{ fontSize: 14, textAlign: "center", fontWeight: 600 }}>Members</Typography>
              </Grid>
              <Grid item xs={1}>
                <IconButton onClick={handlePopClose} sx={{ padding: 0 }}>
                  <CloseOutlinedIcon sx={{ width: 20, height: 20 }} />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item>
              <TextField size="small" value={searchMember} onChange={handleSearchMember} placeholder="Search members..." inputProps={{ style: { fontSize: 14 } }} sx={{ width: "100%" }} />
            </Grid>
            <Grid container item sx={{ flexDirection: "column", gap: 1 }}>
              <Grid item>
                <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Board members</Typography>
              </Grid>
              {boardMember
                .filter((board_member_item) => {
                  return board_member_item.username.includes(searchMember) || searchMember == "";
                })
                .map((board_member_item) => (
                  <Grid key={board_member_item.user_id} container item>
                    <Button
                      onClick={() => {
                        handleAssignedMemberUpdate(board_member_item.user_id, !checkIncludeMember(board_member_item));
                      }}
                      sx={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "left", gap: 1, textTransform: "none", color: "black" }}
                    >
                      <Avatar sx={{ bgcolor: "#BEB6F2", width: 32, height: 32, fontSize: 12, fontWeight: 600 }}>{board_member_item.username[0]?.toUpperCase()}</Avatar>
                      <Typography sx={{ fontSize: 14 }}> {board_member_item.username}</Typography>
                      {checkIncludeMember(board_member_item) && <CheckOutlinedIcon sx={{ width: 20, height: 20, marginLeft: "auto" }} />}
                    </Button>
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Box>
      </Popover>
    </>
  );
};
export default MembersButton;
