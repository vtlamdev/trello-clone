import React, { ChangeEvent, useState } from "react";
import { Box, Button, Grid, IconButton, Popover, TextField, Typography } from "@mui/material";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const ChecklistButton: React.FC<{ checklistAdd: (title: string) => Promise<boolean | undefined> }> = ({ checklistAdd }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [checklistName, setChecklistName] = useState<string>("Checklist");

  const handlePopClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setChecklistName("Checklist");
  };

  const handlePopClose = () => {
    setAnchorEl(null);
    setChecklistName("");
  };

  const handleChecklistNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecklistName(e.target.value);
  };

  const handleChecklistAdd = async () => {
    const isChecklistAdd = await checklistAdd(checklistName);
    if (isChecklistAdd) {
    } else {
    }
    setAnchorEl(null);
    setChecklistName("");
  };

  return (
    <>
      <Button
        aria-describedby="checklist_button"
        onClick={handlePopClick}
        sx={{ display: "flex", justifyContent: "flex-start", width: "100%", textTransform: "none", color: "black", backgroundColor: "#F0F0F0" }}
      >
        <CheckBoxOutlinedIcon sx={{ width: 16, height: 16 }} />
        <Typography sx={{ fontSize: 14, marginLeft: 1 }}>Checklist</Typography>
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
                <Typography sx={{ fontSize: 14, textAlign: "center", fontWeight: 600 }}>Add checklist</Typography>
              </Grid>
              <Grid item xs={1}>
                <IconButton onClick={handlePopClose} sx={{ padding: 0 }}>
                  <CloseOutlinedIcon sx={{ width: 20, height: 20 }} />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item>
              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Title</Typography>
            </Grid>
            <Grid item>
              <TextField size="small" value={checklistName} onChange={handleChecklistNameChange} placeholder="Enter checklist name..." inputProps={{ style: { fontSize: 14 } }} fullWidth autoFocus />
            </Grid>
            <Grid item>
              {checklistName == "" ? (
                <Button size="small" variant="contained" disabled sx={{ fontSize: 14, fontWeight: 600, textTransform: "none" }}>
                  Add
                </Button>
              ) : (
                <Button onClick={handleChecklistAdd} size="small" variant="contained" sx={{ fontSize: 14, fontWeight: 600, textTransform: "none" }}>
                  Add
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </Popover>
    </>
  );
};
export default ChecklistButton;
