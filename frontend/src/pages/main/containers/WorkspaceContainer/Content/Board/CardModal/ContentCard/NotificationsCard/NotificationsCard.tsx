import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Checkbox, Grid, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const NotificationsCard: React.FC<{ is_watch: boolean; watchUpdate: (watch: boolean) => Promise<void> }> = ({ is_watch, watchUpdate }) => {
  const [watching, setWatching] = useState<boolean>(false);

  useEffect(() => {
    setWatching(is_watch);
  }, [is_watch]);

  const handleWatchingChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setWatching(e.target.checked);
    await watchUpdate(e.target.checked);
  };

  return (
    <Grid container item sx={{ flexDirection: "column", width: "auto" }}>
      <Grid item>
        <Typography sx={{ fontSize: 12 }}>Notifications</Typography>
      </Grid>
      <Grid item>
        <Box sx={{ borderRadius: "5px", backgroundColor: "#F0F0F0", height: 32, display: "flex", flexDirection: "row", alignItems: "center", padding: 0.5, gap: 0.5 }}>
          <VisibilityOutlinedIcon sx={{ width: 20, height: 20 }} />
          {watching ? <Typography sx={{ fontSize: 14 }}>Watching</Typography> : <Typography sx={{ fontSize: 14 }}>Watch</Typography>}
          <Checkbox checked={watching} onChange={handleWatchingChange} sx={{ width: 30, height: 30 }} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default NotificationsCard;
