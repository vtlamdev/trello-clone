import React from "react";
import { Box, Grid, Typography } from "@mui/material";

import { Label } from "../../CardModel";

const LabelsCard: React.FC<{ label: Label[] }> = ({ label }) => {
  return (
    <Grid container item sx={{ flexDirection: "column", width: "auto" }}>
      <Grid item>
        <Typography sx={{ fontSize: 12 }}>Labels</Typography>
      </Grid>
      <Grid item sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}>
        {label.map((label_item) => (
          <Box key={label_item.label_id} sx={{ backgroundColor: `${label_item.value}`, width: "auto", height: 32, minWidth: 50, padding: "5px", borderRadius: "5px" }}>
            <Typography sx={{ fontSize: 14, textAlign: "center" }}>{label_item.title}</Typography>
          </Box>
        ))}
      </Grid>
    </Grid>
  );
};

export default LabelsCard;
