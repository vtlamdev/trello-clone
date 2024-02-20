import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Checkbox, Grid, IconButton, Popover, TextField, Typography } from "@mui/material";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Item } from "../../../CardModel";

const ChecklistItem: React.FC<{
  checklist_id: string;
  item: Item;
  checklistItemNameUpdate: (checklist_id: string, checklist_item_id: string, name: string) => Promise<boolean | undefined>;
  checklistItemCheckValueUpdate: (checklist_id: string, checkllist_item_id: string, is_checked: boolean) => Promise<boolean | undefined>;
  checklistItemDelete: (checklist_id: string, checklist_item_id: string) => Promise<boolean | undefined>;
  convertToCard: (checklist_id: string, checklist_item_id: string, name: string) => Promise<boolean | undefined>;
}> = ({ checklist_id, item, checklistItemNameUpdate, checklistItemCheckValueUpdate, checklistItemDelete, convertToCard }) => {
  const [itemName, setItemName] = useState<string>(item.name);
  const [editItemName, setEditItemName] = useState<boolean>(false);
  const [itemCheckValue, setItemCheckValue] = useState<boolean>(item.is_checked);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setItemName(item.name);
    setItemCheckValue(item.is_checked);
  }, [item]);

  const handleEditItemName = () => {
    setEditItemName(true);
  };

  const handleItemNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItemName(e.target.value);
  };

  const handleSaveItemName = async () => {
    const isNameUpdate = await checklistItemNameUpdate(checklist_id, item.item_id, itemName);
    if (isNameUpdate) {
      setEditItemName(false);
    } else {
    }
  };

  const handleCancelItemName = () => {
    setEditItemName(false);
    setItemName(item.name);
  };

  const handleItemCheckValueChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setItemCheckValue(e.target.checked);
    const isCheckValue = await checklistItemCheckValueUpdate(checklist_id, item.item_id, e.target.checked);
    if (isCheckValue) {
    } else {
      setItemCheckValue(item.is_checked);
    }
  };

  const handlePopClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopClose = () => {
    setAnchorEl(null);
  };

  const handleItemDelete = async () => {
    const isItemDelete = await checklistItemDelete(checklist_id, item.item_id);
    if (isItemDelete) {
    } else {
    }
  };

  const handleConvertToCard = async () => {
    const isConverted = await convertToCard(checklist_id, item.item_id, item.name);
    if (isConverted) {
    } else {
    }
  };

  return (
    <Grid container item xs={12} sx={{ flexDirection: "row", alignItems: "center" }}>
      <Grid item xs={1} sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <Checkbox checked={itemCheckValue} onChange={handleItemCheckValueChange} sx={{ width: 30, height: 30 }} />
      </Grid>
      {!editItemName ? (
        <Grid container item xs={11} sx={{ flexDirection: "row", alignItems: "center" }}>
          <Grid item xs={11}>
            <Button onClick={handleEditItemName} size="small" sx={{ textTransform: "none", color: "black", fontSize: 14 }}>
              {itemName}
            </Button>
          </Grid>
          <Grid item xs={1} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton aria-describedby="item_more_button" onClick={handlePopClick}>
              <MoreHorizOutlinedIcon sx={{ width: 25, height: 25 }} />
            </IconButton>
            <Popover
              id="item_more_button"
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
                      <Typography sx={{ fontSize: 14, textAlign: "center", fontWeight: 600 }}>Item actions</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton onClick={handlePopClose} sx={{ padding: 0 }}>
                        <CloseOutlinedIcon sx={{ width: 20, height: 20 }} />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Grid container item sx={{ flexDirection: "row", gap: 1 }}>
                    <Grid item xs={12}>
                      <Button onClick={handleConvertToCard} sx={{ fontSize: 14, textTransform: "none", color: "black", width: "100%", justifyContent: "left" }}>
                        Convert to card
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button onClick={handleItemDelete} sx={{ fontSize: 14, textTransform: "none", color: "black", width: "100%", justifyContent: "left" }}>
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Popover>
          </Grid>
        </Grid>
      ) : (
        <Grid container item xs={11} sx={{ flexDirection: "column", gap: 1 }}>
          <Grid item xs={12}>
            <TextField size="small" value={itemName} onChange={handleItemNameChange} inputProps={{ style: { fontSize: 14 } }} sx={{ width: "100%" }} />
          </Grid>
          <Grid item xs={12} sx={{ flexDirection: "row", gap: 0.5 }}>
            <Button variant="contained" onClick={handleSaveItemName} sx={{ height: 32, textTransform: "none", fontSize: 12 }}>
              Save
            </Button>
            <Button variant="text" onClick={handleCancelItemName} sx={{ height: 32, textTransform: "none", fontSize: 12 }}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default ChecklistItem;
