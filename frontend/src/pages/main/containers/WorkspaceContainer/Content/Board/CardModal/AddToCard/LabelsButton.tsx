import React, { ChangeEvent, useState } from "react";
import { Box, Button, Checkbox, Grid, IconButton, Popover, TextField, Typography } from "@mui/material";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Label } from "../CardModel";
import { LabelModal } from "../../BoardModal/BoardModal";

const LabelsButton: React.FC<{ label_card: Label[]; boardLabel: LabelModal[]; cardLabelUpdate: (label_id: string, is_selected: boolean) => Promise<boolean | undefined> }> = ({
  label_card,
  boardLabel,
  cardLabelUpdate,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchLabel, setSearchLabel] = useState<string>("");

  const handlePopClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopClose = () => {
    setAnchorEl(null);
  };

  const handleSearchLabel = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchLabel(e.target.value);
  };

  const handleCheckLabelChange = async (label_id: string, is_selected: boolean) => {
    const isLabelUpdate = await cardLabelUpdate(label_id, is_selected);
    if (isLabelUpdate) {
    } else {
    }
  };

  const checkIncludeLabel = (label_item: Label) => {
    let label_it: Label;
    for (label_it of label_card) {
      if (label_it.label_id == label_item.label_id) return true;
    }
    return false;
  };

  return (
    <>
      <Button
        aria-describedby="label_button"
        onClick={handlePopClick}
        sx={{ display: "flex", justifyContent: "flex-start", width: "100%", textTransform: "none", color: "black", backgroundColor: "#F0F0F0" }}
      >
        <LabelOutlinedIcon sx={{ width: 16, height: 16 }} />
        <Typography sx={{ fontSize: 14, marginLeft: 1 }}>Labels</Typography>
      </Button>
      <Popover
        id="label_button"
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
                <Typography sx={{ fontSize: 14, textAlign: "center", fontWeight: 600 }}>Labels</Typography>
              </Grid>
              <Grid item xs={1}>
                <IconButton onClick={handlePopClose} sx={{ padding: 0 }}>
                  <CloseOutlinedIcon sx={{ width: 20, height: 20 }} />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item>
              <TextField size="small" value={searchLabel} onChange={handleSearchLabel} placeholder="Search labels..." inputProps={{ style: { fontSize: 14 } }} sx={{ width: "100%" }} />
            </Grid>
            <Grid container item sx={{ flexDirection: "row", gap: 1 }}>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Labels</Typography>
              </Grid>
              {boardLabel.length != 0 &&
                boardLabel
                  .filter((board_label_item) => {
                    return board_label_item.title.includes(searchLabel) || searchLabel == "";
                  })
                  .map((label_item) => (
                    <Grid key={label_item.label_id} container item xs={12} sx={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <Grid item xs={1}>
                        <Checkbox checked={checkIncludeLabel(label_item)} onChange={() => handleCheckLabelChange(label_item.label_id, !checkIncludeLabel(label_item))} sx={{ width: 20, height: 20 }} />
                      </Grid>
                      <Grid item xs={9}>
                        <Typography sx={{ fontSize: 14, backgroundColor: `${label_item.value}`, padding: 1, borderRadius: "5px" }}>{label_item.title}</Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton sx={{ padding: 0 }}>
                          <EditOutlinedIcon sx={{ width: 20, height: 20 }} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
              <Grid item xs={12}>
                <Button size="small" sx={{ width: "100%", fontSize: 14, textTransform: "none", color: "black", backgroundColor: "whitesmoke" }}>
                  Create a new label
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Popover>
    </>
  );
};
export default LabelsButton;
