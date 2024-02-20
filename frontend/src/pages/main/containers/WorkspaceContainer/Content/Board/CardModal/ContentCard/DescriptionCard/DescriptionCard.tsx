import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import Textarea from "@mui/joy/Textarea";
import SubjectOutlinedIcon from "@mui/icons-material/SubjectOutlined";

const DescriptionCard: React.FC<{ description_card: string; descriptionUpdate: (description: string) => Promise<void> }> = ({ description_card, descriptionUpdate }) => {
  const [description, setDescription] = useState<string>(description_card);
  const [editDescription, setEditDescription] = useState<boolean>(false);

  useEffect(() => {
    setDescription(description_card);
  }, [description_card]);

  const handleEditDescription = () => {
    setEditDescription(true);
  };
  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSaveDescription = async () => {
    await descriptionUpdate(description);
    setEditDescription(false);
  };

  const handleCancelDescription = () => {
    setEditDescription(false);
    setDescription(description_card);
  };

  return (
    <Grid container item sx={{ flexDirection: "column", gap: 1 }}>
      <Grid container item sx={{ flexDirection: "row", alignItems: "center" }}>
        <Grid item md={1}>
          <SubjectOutlinedIcon sx={{ width: 25, heigh: 25 }} />
        </Grid>
        <Grid item md={9}>
          <Typography sx={{ fontSize: 16 }}>Description</Typography>
        </Grid>
        <Grid item md={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
          {!editDescription && (
            <Button onClick={handleEditDescription} sx={{ backgroundColor: "#F0F0F0", height: 32, textTransform: "none", color: "black", fontSize: 14 }}>
              Edit
            </Button>
          )}
        </Grid>
      </Grid>
      <Grid container item sx={{ flexDirection: "row", alignItems: "center" }}>
        <Grid item xs={1}></Grid>
        <Grid container item xs={11} sx={{ flexDirection: "column", gap: 0.5 }}>
          <Grid item>
            {editDescription ? <Textarea onChange={handleDescriptionChange} value={description} autoFocus sx={{ fontSize: 14 }} /> : <Typography sx={{ fontSize: 14 }}>{description}</Typography>}
          </Grid>
          {editDescription && (
            <Grid container item sx={{ flexDirection: "row", gap: 0.5 }}>
              <Button variant="contained" onClick={handleSaveDescription} sx={{ height: 32, textTransform: "none", fontSize: 14 }}>
                Save
              </Button>
              <Button variant="text" onClick={handleCancelDescription} sx={{ height: 32, textTransform: "none", fontSize: 14 }}>
                Cancel
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DescriptionCard;
