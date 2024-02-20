import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import { Attachment } from "../../CardModel";

const AttachmentsCard: React.FC<{ attachment_card: Attachment[] }> = ({ attachment_card }) => {
  const [attachment, setAttachment] = useState<Attachment[]>();
  useEffect(()=>{
    setAttachment(attachment_card)
  },[attachment_card])
  return (
    <Grid container item sx={{ flexDirection: "column", gap: 1 }}>
      <Grid container item sx={{ flexDirection: "row", alignItems: "center" }}>
        <Grid item md={1}>
          <AttachFileOutlinedIcon sx={{ width: 25, height: 25 }} />
        </Grid>
        <Grid item md={9}>
          <Typography sx={{ fontSize: 16 }}>Attachments</Typography>
        </Grid>
        <Grid item md={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button sx={{ backgroundColor: "#F0F0F0", height: 32, textTransform: "none", color: "black", fontSize: 14 }}>Add</Button>
        </Grid>
      </Grid>
      <Grid container item sx={{ flexDirection: "row", alignItems: "center" }}>
        <Grid item xs={1}></Grid>
        {attachment? attachment.map((attachment_item) => (
          <Grid key={attachment_item.file_id} container item xs={11} sx={{ flexDirection: "row", alignItems: "center" }}>
            <Grid item xs={2}>
              <Box sx={{ display: "flex", backgroundColor: "#F0F0F0", justifyContent: "center", alignItems: "center", height: 50, width: 50 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "grey" }}>{attachment_item.type}</Typography>
              </Box>
            </Grid>
            <Grid container item xs={10} sx={{ flexDirection: "column", alignItems: "center" }}>
              <Grid container item sx={{ alignItems: "center" }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{attachment_item.name}</Typography>
                <ArrowOutwardOutlinedIcon sx={{ width: 18, height: 18, marginLeft: "5px" }} />
              </Grid>
              <Grid container item sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                <Typography sx={{ fontSize: 12 }}>Added on {`${attachment_item.added_date.slice(0, 10)} ${attachment_item.added_date.slice(11, 19)}`}</Typography>
                <Button variant="text" sx={{ fontSize: 12, textTransform: "none", padding: 0, minWidth: "auto" }}>
                  Comment
                </Button>
                <Button variant="text" sx={{ fontSize: 12, textTransform: "none", padding: 0, minWidth: "auto" }}>
                  Delete
                </Button>
                <Button variant="text" sx={{ fontSize: 12, textTransform: "none", padding: 0, minWidth: "auto" }}>
                  Edit
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )):null}
      </Grid>
    </Grid>
  );
};

export default AttachmentsCard;
