import React from "react";
import { Button, Typography } from "@mui/material";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

const CopyButton: React.FC = () => {
  return (
    <Button sx={{ display: "flex", justifyContent: "flex-start", width: "100%", textTransform: "none", color: "black", backgroundColor: "#F0F0F0" }}>
      <ContentCopyOutlinedIcon sx={{ width: 16, height: 16 }} />
      <Typography sx={{ fontSize: 14, marginLeft: 1 }}>Copy</Typography>
    </Button>
  );
};
export default CopyButton;
