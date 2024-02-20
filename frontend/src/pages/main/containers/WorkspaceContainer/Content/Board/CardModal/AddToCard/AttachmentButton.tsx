import React, { useState } from "react";
import { Box, Button, Grid, IconButton, Popover, Typography } from "@mui/material";
import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const AttachmentButton: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        aria-describedby="attachment_button"
        onClick={handlePopClick}
        sx={{ display: "flex", justifyContent: "flex-start", width: "100%", textTransform: "none", color: "black", backgroundColor: "#F0F0F0" }}
      >
        <AttachmentOutlinedIcon sx={{ width: 16, height: 16 }} />
        <Typography sx={{ fontSize: 14, marginLeft: 1 }}>Attachment</Typography>
      </Button>
      <Popover
        id="attachment_button"
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
                <Typography sx={{ fontSize: 14, textAlign: "center", fontWeight: 600 }}>Attach</Typography>
              </Grid>
              <Grid item xs={1}>
                <IconButton onClick={handlePopClose} sx={{ padding: 0 }}>
                  <CloseOutlinedIcon sx={{ width: 20, height: 20 }} />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item>
              <Typography>Content</Typography>
            </Grid>
            <Grid item>
              <Button size="small" variant="text" sx={{ textTransform: "none", width: "100%", color: "black", backgroundColor: "whitesmoke" }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Popover>
    </>
  );
};
export default AttachmentButton;
