import React, { useState } from "react";
import { Box, Button, Grid, IconButton, Popover, Typography } from "@mui/material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const DatesButton: React.FC<{
  start_date: string;
  due_date: string;
  is_completed: boolean;
  dateUpdate: (start_date: string, due_date: string, is_completed: boolean) => Promise<boolean | undefined>;
}> = ({ start_date, due_date, is_completed, dateUpdate }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(start_date != "" ? dayjs(start_date, "DD/MM/YYYY, HH:mm:ss") : null);
  const [dueDate, setDueDate] = useState<dayjs.Dayjs | null>(due_date != "" ? dayjs(due_date, "DD/MM/YYYY, HH:mm:ss") : null);

  const handlePopClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopClose = () => {
    setStartDate(start_date != "" ? dayjs(start_date, "DD/MM/YYYY, HH:mm:ss") : null);
    setDueDate(due_date != "" ? dayjs(due_date, "DD/MM/YYYY, HH:mm:ss") : null);
    setAnchorEl(null);
  };

  const handleChangeStartDate = (newValue: dayjs.Dayjs | null) => {
    setStartDate(newValue);
  };

  const handleChangeDueDate = (newValue: dayjs.Dayjs | null) => {
    setDueDate(newValue);
  };

  const handleSaveDate = async () => {
    const newStartDate = startDate != null ? dayjs(startDate).format("DD/MM/YYYY, HH:mm:ss") : "";
    const newDueDate = dueDate != null ? dayjs(dueDate).format("DD/MM/YYYY, HH:mm:ss") : "";
    if (
      newDueDate != "" &&
      (newStartDate != "" ? Date.parse(dayjs(newStartDate, "DD/MM/YYYY, HH:mm:ss").format("YYYY/MM/DD, HH:mm:ss")) : 0) >
        Date.parse(dayjs(newDueDate, "DD/MM/YYYY, HH:mm:ss").format("YYYY/MM/DD, HH:mm:ss"))
    ) {
      toast.error("Date picked is not valid!");
    } else {
      const isDateUpdate = await dateUpdate(newStartDate, newDueDate, is_completed);
      if (isDateUpdate) {
        setAnchorEl(null);
      } else {
      }
    }
  };

  const handleRemoveDate = async () => {
    const isDateUpdate = await dateUpdate("", "", false);
    if (isDateUpdate) {
      setAnchorEl(null);
      setStartDate(null);
      setDueDate(null);
    } else {
    }
  };

  return (
    <>
      <Button
        aria-describedby="date_button"
        onClick={handlePopClick}
        sx={{ display: "flex", justifyContent: "flex-start", width: "100%", textTransform: "none", color: "black", backgroundColor: "#F0F0F0" }}
      >
        <AccessTimeOutlinedIcon sx={{ width: 16, height: 16 }} />
        <Typography sx={{ fontSize: 14, marginLeft: 1 }}>Dates</Typography>
      </Button>
      <Popover id="date_button" open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handlePopClose}>
        <Box sx={{ padding: 2, width: "300px" }}>
          <Grid container sx={{ flexDirection: "column", gap: 1 }}>
            <Grid container item sx={{ flexDirection: "row", alignItems: "center" }}>
              <Grid item xs={1}></Grid>
              <Grid item xs={10}>
                <Typography sx={{ fontSize: 14, textAlign: "center", fontWeight: 600 }}>Dates</Typography>
              </Grid>
              <Grid item xs={1}>
                <IconButton onClick={handlePopClose} sx={{ padding: 0 }}>
                  <CloseOutlinedIcon sx={{ width: 20, height: 20 }} />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DesktopDateTimePicker", "DesktopDateTimePicker"]}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Start date</Typography>
                  <DesktopDateTimePicker format="DD/MM/YYYY, HH:mm:ss" value={startDate} onChange={(newValue) => handleChangeStartDate(newValue)} />
                  <Typography sx={{ fontSize: 12, fontWeight: 600 }}>End date</Typography>
                  <DesktopDateTimePicker
                    format="DD/MM/YYYY, HH:mm:ss"
                    value={dueDate}
                    onChange={(newValue) => handleChangeDueDate(newValue)}
                    views={["day", "month", "year", "hours", "minutes", "seconds"]}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item sx={{ marginTop: 2 }}>
              <Button onClick={handleSaveDate} size="small" variant="contained" sx={{ textTransform: "none", width: "100%", fontSize: 12, fontWeight: 600 }}>
                Save
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleRemoveDate}
                size="small"
                variant="text"
                sx={{ textTransform: "none", width: "100%", color: "black", backgroundColor: "whitesmoke", fontSize: 12, fontWeight: 600 }}
              >
                Remove
              </Button>
            </Grid>
          </Grid>
        </Box>
        <ToastContainer position="bottom-right" autoClose={1000} hideProgressBar={true} />
      </Popover>
    </>
  );
};
export default DatesButton;
