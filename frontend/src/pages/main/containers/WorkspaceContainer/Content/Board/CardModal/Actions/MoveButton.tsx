import React from "react";
import { Button, Typography } from "@mui/material";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";

const MoveButton: React.FC = () => {
  return (
    <Button sx={{ display: "flex", justifyContent: "flex-start", width: "100%", textTransform: "none", color: "black", backgroundColor: "#F0F0F0" }}>
      <ArrowRightAltOutlinedIcon sx={{ width: 16, height: 16 }} />
      <Typography sx={{ fontSize: 14, marginLeft: 1 }}>Move</Typography>
    </Button>
  );
};
export default MoveButton;
