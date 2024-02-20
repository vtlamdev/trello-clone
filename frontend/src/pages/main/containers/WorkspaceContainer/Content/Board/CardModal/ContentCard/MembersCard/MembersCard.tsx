import React from "react";
import { Avatar, Grid, Typography } from "@mui/material";

import { Assign } from "../../CardModel";

const MembersCard: React.FC<{ member: Assign[] }> = ({ member }) => {
  return (
    <Grid container item sx={{ flexDirection: "column", width: "auto" }}>
      <Grid item>
        <Typography sx={{ fontSize: 12 }}>Members</Typography>
      </Grid>
      <Grid item sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}>
        {member.map((member_item) => (
          <Avatar key={member_item.user_id} sx={{ bgcolor: "#BEB6F2", width: 32, height: 32, fontSize: 12, fontWeight: 600 }}>
            {member_item.username && member_item.username[0].toUpperCase()}
          </Avatar>
        ))}
      </Grid>
    </Grid>
  );
};

export default MembersCard;
