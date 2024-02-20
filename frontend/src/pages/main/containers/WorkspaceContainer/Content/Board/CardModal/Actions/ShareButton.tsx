import React from "react";
import { Button, Typography } from "@mui/material";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

const ShareButton: React.FC = () => {
  return (
    <Button sx={{ display: "flex", justifyContent: "flex-start", width: "100%", textTransform: "none", color: "black", backgroundColor: "#F0F0F0" }}>
      <ShareOutlinedIcon sx={{ width: 16, height: 16 }} />
      <Typography sx={{ fontSize: 14, marginLeft: 1 }}>Share</Typography>
    </Button>
  );
};
export default ShareButton;
