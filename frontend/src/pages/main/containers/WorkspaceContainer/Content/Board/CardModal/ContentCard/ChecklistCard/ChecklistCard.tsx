import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Grid, LinearProgress, TextField, Typography } from "@mui/material";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import { Checklist, Item } from "../../CardModel";
import ChecklistItem from "./ChecklistItem/ChecklistItem";

const ChecklistCard: React.FC<{
  checkList_element: Checklist;
  checklistUpdate: (checklist_id: string, title: string) => Promise<boolean | undefined>;
  checklistDelete: (checklist_id: string) => Promise<boolean | undefined>;
  checklistItemAdd: (checklist_id: string, name: string) => Promise<boolean | undefined>;
  checklistItemNameUpdate: (checklist_id: string, checklist_item_id: string, name: string) => Promise<boolean | undefined>;
  checklistItemCheckValueUpdate: (checklist_id: string, checklist_item_id: string, is_checked: boolean) => Promise<boolean | undefined>;
  checklistItemDelete: (checklist_id: string, checklist_item_id: string) => Promise<boolean | undefined>;
  convertToCard: (checklist_id: string, checklist_item_id: string, name: string) => Promise<boolean | undefined>;
}> = ({ checkList_element, checklistUpdate, checklistDelete, checklistItemAdd, checklistItemNameUpdate, checklistItemCheckValueUpdate, checklistItemDelete, convertToCard }) => {
  const [checkListTitle, setCheckListTitle] = useState<string>(checkList_element.title);
  const [editCheckListTitle, setEditCheckListTitle] = useState<boolean>(false);
  const [checklistItemName, setChecklistItemName] = useState<string>("");
  const [editChecklistItemName, setEditChecklistItemName] = useState<boolean>(false);

  useEffect(() => {
    setCheckListTitle(checkList_element.title);
  }, [checkList_element]);

  const handleEditCheckListTitle = () => {
    setEditCheckListTitle(true);
  };

  const handleCheckListTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCheckListTitle(e.target.value);
  };

  const handleSaveCheckListTitle = async () => {
    const isChecklistUpdate = await checklistUpdate(checkList_element.check_list_id, checkListTitle);
    if (isChecklistUpdate) {
    } else {
    }
    setEditCheckListTitle(false);
  };

  const handleCancelCheckListTitle = () => {
    setEditCheckListTitle(false);
    setCheckListTitle(checkList_element.title);
  };

  const handleChecklistDelete = async () => {
    const isChecklistDelete = await checklistDelete(checkList_element.check_list_id);
    if (isChecklistDelete) {
    } else {
    }
  };

  const handleEditChecklistItemName = () => {
    setEditChecklistItemName(true);
  };

  const handleChecklistItemNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecklistItemName(e.target.value);
  };

  const handleCancelChecklistItemName = () => {
    setEditChecklistItemName(false);
    setChecklistItemName("");
  };

  const handleChecklistItemAdd = async () => {
    const isChecklistItemAdd = await checklistItemAdd(checkList_element.check_list_id, checklistItemName);
    if (isChecklistItemAdd) {
      setEditChecklistItemName(false);
      setChecklistItemName("");
    } else {
    }
  };

  const progressValue = () => {
    let item: Item;
    let countComplete = 0;
    for (item of checkList_element.item) {
      if (item.is_checked) {
        countComplete += 1;
      }
    }
    if (checkList_element.item.length == 0) return 0;
    return Math.round((countComplete / checkList_element.item.length) * 100);
  };

  return (
    <Grid container item sx={{ flexDirection: "column", gap: 1 }}>
      <Grid container item sx={{ flexDirection: "row", alignItems: "flex-start" }}>
        <Grid item xs={1}>
          <CheckBoxOutlinedIcon sx={{ width: 25, height: 25 }} />
        </Grid>
        {!editCheckListTitle ? (
          <Grid container item xs={11}>
            <Grid item xs={10}>
              <Button onClick={handleEditCheckListTitle} size="small" sx={{ padding: 0, textTransform: "none", color: "black", fontSize: 16 }}>
                {checkListTitle}
              </Button>
            </Grid>
            <Grid item xs={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleChecklistDelete} sx={{ backgroundColor: "#F0F0F0", height: 32, textTransform: "none", color: "black", fontSize: 14 }}>
                Delete
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid container item xs={11} sx={{ flexDirection: "column", gap: 1 }}>
            <Grid item xs={12}>
              <TextField size="small" value={checkListTitle} onChange={handleCheckListTitleChange} fullWidth autoFocus />
            </Grid>
            <Grid item xs={12} sx={{ flexDirection: "row", gap: 0.5 }}>
              <Button variant="contained" onClick={handleSaveCheckListTitle} sx={{ height: 32, textTransform: "none", fontSize: 14 }}>
                Save
              </Button>
              <Button variant="text" onClick={handleCancelCheckListTitle} sx={{ height: 32, textTransform: "none", fontSize: 14 }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>

      <Grid container item sx={{ flexDirection: "row", alignItems: "center" }}>
        <Grid container item xs={12} sx={{ flexDirection: "row", alignItems: "center" }}>
          <Grid item xs={1}>
            <Typography sx={{ textAlign: "center", fontSize: 12 }}>{`${progressValue()}%`}</Typography>
          </Grid>
          <Grid item xs={11}>
            <LinearProgress variant="determinate" color="primary" value={progressValue()} sx={{ height: "8px", width: "100%", borderRadius: "5px" }} />
          </Grid>
        </Grid>
        <Grid container item sx={{ flexDirection: "column", gap: 1 }}>
          {checkList_element.item.map((item) => (
            <ChecklistItem
              key={item.item_id}
              checklist_id={checkList_element.check_list_id}
              item={item}
              checklistItemNameUpdate={checklistItemNameUpdate}
              checklistItemCheckValueUpdate={checklistItemCheckValueUpdate}
              checklistItemDelete={checklistItemDelete}
              convertToCard={convertToCard}
            />
          ))}
          <Grid container item xs={12}>
            <Grid item xs={1}></Grid>
            <Grid item xs={11}>
              {!editChecklistItemName ? (
                <Button onClick={handleEditChecklistItemName} sx={{ backgroundColor: "lightgrey", height: 32, textTransform: "none", color: "black" }}>
                  Add an item
                </Button>
              ) : (
                <Grid container item xs={11} sx={{ flexDirection: "column", gap: 1 }}>
                  <Grid item xs={12}>
                    <TextField size="small" value={checklistItemName} onChange={handleChecklistItemNameChange} fullWidth autoFocus />
                  </Grid>
                  <Grid item xs={12} sx={{ flexDirection: "row", gap: 0.5 }}>
                    <Button variant="contained" onClick={handleChecklistItemAdd} sx={{ height: 32, textTransform: "none", fontSize: 14 }}>
                      Save
                    </Button>
                    <Button variant="text" onClick={handleCancelChecklistItemName} sx={{ height: 32, textTransform: "none", fontSize: 14 }}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChecklistCard;
