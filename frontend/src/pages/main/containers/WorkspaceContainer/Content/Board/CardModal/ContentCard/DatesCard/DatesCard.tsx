import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Checkbox, Grid, Typography } from "@mui/material";
import dayjs from "dayjs";

const DatesCard: React.FC<{
  start_date: string;
  due_date: string;
  is_completed: boolean;
  dateUpdate: (start_date: string, due_date: string, is_completed: boolean) => Promise<boolean | undefined>;
}> = ({ start_date, due_date, is_completed, dateUpdate }) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(is_completed);

  useEffect(() => {
    setIsCompleted(is_completed);
  }, [start_date, due_date, is_completed]);

  const handleCompletedChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setIsCompleted(e.target.checked);
    const isDateUpdate = await dateUpdate(start_date, due_date, e.target.checked);
    if (isDateUpdate) {
    } else {
      setIsCompleted(is_completed);
    }
  };

  return (
    <Grid container item sx={{ flexDirection: "column", width: "auto" }}>
      <Grid item>
        <Typography sx={{ fontSize: 12 }}>Dates</Typography>
      </Grid>
      <Grid item>
        <Box sx={{ borderRadius: "5px", backgroundColor: "#F0F0F0", height: 32, display: "flex", flexDirection: "row", alignItems: "center", gap: 1, padding: 1 }}>
          <Checkbox checked={isCompleted} onChange={handleCompletedChange} sx={{ width: 30, height: 30 }} />
          <Typography sx={{ fontSize: 14 }}>{`${start_date != "" ? start_date : "No start date"} - ${due_date != "" ? due_date : "No due date"}`}</Typography>
          {isCompleted ? (
            <Typography sx={{ fontSize: 12, backgroundColor: "limegreen", color: "white", borderRadius: "5px", padding: "5px", fontWeight: 600 }}>Complete</Typography>
          ) : (
            Date.now() - Date.parse(dayjs(due_date, "DD/MM/YYYY, HH:mm:ss").format("YYYY/MM/DD, HH:mm:ss")) >= 0 && (
              <Typography sx={{ fontSize: 12, backgroundColor: "brown", color: "white", borderRadius: "5px", padding: "5px", fontWeight: 600 }}>Overdue</Typography>
            )
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default DatesCard;
