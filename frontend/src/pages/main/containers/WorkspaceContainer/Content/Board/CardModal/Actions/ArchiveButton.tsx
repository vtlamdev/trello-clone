import React, { useState } from "react";
import { Box, Button, Grid, IconButton, Popover, Typography } from "@mui/material";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const ArchiveButton: React.FC<{ isArchived: boolean; archiveUpdate: (is_archived: boolean) => Promise<boolean | undefined>; deleteCard: () => Promise<boolean | undefined> }> = ({
  isArchived,
  archiveUpdate,
  deleteCard,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopClose = () => {
    setAnchorEl(null);
  };

  const handleArchiveCard = async () => {
    const isArchived = await archiveUpdate(true);
    if (isArchived) {
    } else {
    }
  };

  const handleSendToBoard = async () => {
    const isSendToBoard = await archiveUpdate(false);
    if (isSendToBoard) {
    } else {
    }
  };

  const handleDeleteCard = async () => {
    const isDeleteCard = await deleteCard();
    if (isDeleteCard) {
    } else {
    }
  };

  return (
    <>
      {isArchived ? (
        <>
          <Button onClick={handleSendToBoard} sx={{ display: "flex", justifyContent: "flex-start", width: "100%", textTransform: "none", color: "black", backgroundColor: "#F0F0F0" }}>
            <ReplayOutlinedIcon sx={{ width: 16, height: 16 }} />
            <Typography sx={{ fontSize: 14, marginLeft: 1 }}>Send to board</Typography>
          </Button>
          <Button onClick={handlePopClick} sx={{ display: "flex", justifyContent: "flex-start", width: "100%", textTransform: "none", color: "black", backgroundColor: "brown" }}>
            <RemoveOutlinedIcon sx={{ width: 16, height: 16 }} />
            <Typography sx={{ fontSize: 14, marginLeft: 1 }}>Delete</Typography>
          </Button>
          <Popover
            id="checklist_button"
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
                    <Typography sx={{ fontSize: 14, textAlign: "center", fontWeight: 600 }}>Delete card?</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton onClick={handlePopClose} sx={{ padding: 0 }}>
                      <CloseOutlinedIcon sx={{ width: 20, height: 20 }} />
                    </IconButton>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography sx={{ fontSize: 14 }}>Card will be removed and you won’t be able to reopen the card. There is no undo.</Typography>
                </Grid>
                <Grid item>
                  <Button onClick={handleDeleteCard} sx={{ display: "flex", justifyContent: "flex-start", width: "100%", textTransform: "none", color: "white", backgroundColor: "brown" }}>
                    <RemoveOutlinedIcon sx={{ width: 16, height: 16 }} />
                    <Typography sx={{ fontSize: 14, marginLeft: 1 }}>Delete</Typography>
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Popover>
        </>
      ) : (
        <Button onClick={handleArchiveCard} sx={{ display: "flex", justifyContent: "flex-start", width: "100%", textTransform: "none", color: "black", backgroundColor: "#F0F0F0" }}>
          <ArchiveOutlinedIcon sx={{ width: 16, height: 16 }} />
          <Typography sx={{ fontSize: 14, marginLeft: 1 }}>Archive</Typography>
        </Button>
      )}
    </>
  );
};
export default ArchiveButton;
