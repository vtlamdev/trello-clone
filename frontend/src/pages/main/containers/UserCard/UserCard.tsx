import React, { ChangeEvent, useEffect, useState } from "react";
import { Avatar, Box, Button, Grid, IconButton, MenuItem, Popover, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { DecodeJWT, UserExpired } from "../../../../base/helper/DecodeJWT";
import CardItem from "./CardItem/CardItem";
import CloseIcon from "@mui/icons-material/Close";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import CardModel, { DueDateFilter } from "./UserCardModel";
import { ResponseData } from "../../../../models/responseModel";
import APIClient from "../../../../base/networking/APIClient";
import { RequestData } from "../../../../models/requestModel";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const UserCard: React.FC = () => {
  const [cards, setCards] = useState<CardModel[]>([]);
  const [sortValue, setSortValue] = useState<string>("board");
  const [filterCardInput, setFilterCardInput] = useState<string>("");
  const [filterDueDate, setFilterDueDate] = useState<DueDateFilter>({
    noDate: false,
    completed: false,
    overdue: false,
  });
  const [filterBoardInput, setFilterBoardInput] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const apiClient: APIClient = new APIClient();
      let token = localStorage.getItem("AccessToken") || "";
      if (token) {
        if (!UserExpired()) {
          navigate("/login");
        } else {
          const responseData: ResponseData = await apiClient.getAuthenticatedData(`/card/assignedCard`, {} as RequestData, token);
          if (responseData.success) {
            setCards(() => [...responseData.data]);
          } else {
          }
        }
      } else {
        navigate("/login");
      }
    };
    fetchData();
  }, []);

  const handlePopClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopClose = () => {
    setAnchorEl(null);
  };

  const handleChangeSort = (e: SelectChangeEvent) => {
    setSortValue(e.target.value);
  };

  const handleChangeFilterCardInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterCardInput(e.target.value);
  };

  const handleDueDateClick = (key: string, value: boolean) => {
    setFilterDueDate(() => ({ noDate: false, completed: false, overdue: false, [key]: value }));
  };

  const handleChangeFilterBoardInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterBoardInput(e.target.value);
  };

  const handleClearFilter = () => {
    setFilterCardInput("");
    setFilterDueDate((prev) => ({ ...prev, noDate: false, completed: false, overdue: false }));
    setFilterBoardInput("");
  };

  const sortCard = (cards: CardModel[], option: string) => {
    const resultCards = [...cards];
    if (option == "board") {
      resultCards.sort((first: CardModel, second: CardModel) => {
        const firstUpperCase = first.board.title.toUpperCase();
        const secondUpperCase = second.board.title.toUpperCase();
        if (firstUpperCase < secondUpperCase) {
          return -1;
        } else if (firstUpperCase > secondUpperCase) {
          return 1;
        }
        return 0;
      });
    }
    if (option == "date") {
      resultCards.sort((first: CardModel, second: CardModel) => {
        const firstDueDate = Date.parse(dayjs(first.due_date, "DD/MM/YYYY, HH:mm:ss").format("YYYY/MM/DD, HH:mm:ss")) || 0;
        const secondDueDate = Date.parse(dayjs(second.due_date, "DD/MM/YYYY, HH:mm:ss").format("YYYY/MM/DD, HH:mm:ss")) || 0;
        if (firstDueDate < secondDueDate) {
          return -1;
        } else if (firstDueDate > secondDueDate) {
          return 1;
        }
        return 0;
      });
    }
    return resultCards;
  };

  const filterCard = (cards: CardModel[]) => {
    const resultCards = cards.filter((element) => {
      return (
        (element.name.toUpperCase().includes(filterCardInput.toUpperCase()) || filterCardInput == "") &&
        ((filterDueDate.noDate == true && element.due_date == "") || filterDueDate.noDate == false) &&
        ((filterDueDate.completed == true && element.is_completed == true) || filterDueDate.completed == false) &&
        ((filterDueDate.overdue == true && Date.now() - Date.parse(dayjs(element.due_date, "DD/MM/YYYY, HH:mm:ss").format("YYYY/MM/DD, HH:mm:ss")) > 0 && element.is_completed == false) ||
          filterDueDate.overdue == false) &&
        (element.board.title.toUpperCase().includes(filterBoardInput.toUpperCase()) || filterBoardInput == "")
      );
    });
    return resultCards;
  };

  return (
    <Grid container sx={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
      <Grid container xs={10} item sx={{ flexDirection: "row", height: "90%", padding: 2 }}>
        <Grid container item sx={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", borderBottom: "2px solid lightgrey", padding: 2, gap: 1 }}>
          <Avatar sx={{ bgcolor: "#BEB6F2", width: 35, height: 35, fontSize: 14, fontWeight: 600 }}>{DecodeJWT().data.username[0]?.toUpperCase() || ""}</Avatar>
          <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{DecodeJWT().data.username}</Typography>
        </Grid>
        <Grid container item xs={12} sx={{ flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 2, gap: 1 }}>
          <Grid item>
            <Select onChange={handleChangeSort} size="small" value={sortValue} sx={{ height: 32, fontSize: 14, fontWeight: 600, backgroundColor: "whitesmoke" }}>
              <MenuItem value="board" sx={{ fontSize: 14 }}>
                Sort by board
              </MenuItem>
              <MenuItem value="date" sx={{ fontSize: 14 }}>
                Sort by due date
              </MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <Button aria-describedby="filterCard" onClick={handlePopClick} size="small" sx={{ height: 32, backgroundColor: "whitesmoke", textTransform: "none", color: "black" }}>
              <FilterListIcon sx={{ width: 20, height: 20 }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Filter cards</Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button size="small" onClick={handleClearFilter} sx={{ height: 32, backgroundColor: "whitesmoke", textTransform: "none", color: "black" }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Clear filters</Typography>
            </Button>
          </Grid>

          <Popover
            id="filterCard"
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
            <Box sx={{ width: "300px", display: "flex", flexDirection: "column", padding: 2 }}>
              <Grid container sx={{ flexDirection: "row", alignItems: "center" }}>
                <Grid item xs={1}></Grid>
                <Grid container item xs={10} sx={{ justifyContent: "center" }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Filter cards</Typography>
                </Grid>
                <Grid container item xs={1} sx={{}}>
                  <IconButton onClick={handlePopClose} sx={{ padding: 0 }}>
                    <CloseIcon sx={{ width: 25, height: 25 }} />
                  </IconButton>
                </Grid>
              </Grid>
              <Grid container sx={{ flexDirection: "column", gap: 2 }}>
                <Grid container item sx={{ flexDirection: "row" }}>
                  <Grid item xs={12}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Card</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      size="small"
                      variant="outlined"
                      value={filterCardInput}
                      onChange={handleChangeFilterCardInput}
                      placeholder="Enter a keyword..."
                      sx={{ width: "100%", fontSize: 12 }}
                    ></TextField>
                  </Grid>
                </Grid>
                <Grid container item sx={{ flexDirection: "row" }}>
                  <Grid item xs={12}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Due date</Typography>
                  </Grid>
                  <Grid container item xs={12}>
                    <Button
                      onClick={() => handleDueDateClick("noDate", !filterDueDate.noDate)}
                      size="small"
                      sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", width: "100%", fontSize: 14, textTransform: "none", color: "black", gap: 1 }}
                    >
                      {filterDueDate.noDate ? <CheckBoxOutlinedIcon sx={{ width: 25, height: 25 }} /> : <CheckBoxOutlineBlankOutlinedIcon sx={{ width: 25, height: 25 }} />}
                      <CalendarMonthOutlinedIcon sx={{ width: 25, height: 25 }} />
                      <Typography sx={{ fontSize: 14 }}>No dates</Typography>
                    </Button>
                    <Button
                      onClick={() => handleDueDateClick("completed", !filterDueDate.completed)}
                      size="small"
                      sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", width: "100%", fontSize: 14, textTransform: "none", color: "black", gap: 1 }}
                    >
                      {filterDueDate.completed ? <CheckBoxOutlinedIcon sx={{ width: 25, height: 25 }} /> : <CheckBoxOutlineBlankOutlinedIcon sx={{ width: 25, height: 25 }} />}
                      <ScheduleOutlinedIcon sx={{ width: 25, height: 25, color: "green" }} />
                      <Typography sx={{ fontSize: 14 }}>Due date completed</Typography>
                    </Button>
                    <Button
                      onClick={() => {
                        handleDueDateClick("overdue", !filterDueDate.overdue);
                      }}
                      size="small"
                      sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", width: "100%", fontSize: 14, textTransform: "none", color: "black", gap: 1 }}
                    >
                      {filterDueDate.overdue ? <CheckBoxOutlinedIcon sx={{ width: 25, height: 25 }} /> : <CheckBoxOutlineBlankOutlinedIcon sx={{ width: 25, height: 25 }} />}
                      <ScheduleOutlinedIcon sx={{ width: 25, height: 25, color: "brown" }} />
                      <Typography sx={{ fontSize: 14 }}>Overdue</Typography>
                    </Button>
                  </Grid>
                </Grid>
                <Grid container item sx={{ flexDirection: "row" }}>
                  <Grid item xs={12}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Board</Typography>
                    <TextField
                      size="small"
                      variant="outlined"
                      onChange={handleChangeFilterBoardInput}
                      value={filterBoardInput}
                      placeholder="Filter by Board..."
                      sx={{ width: "100%", fontSize: 12 }}
                    ></TextField>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Popover>
        </Grid>
        <Grid container item xs={12} sx={{ flexDirection: "row", padding: 2, gap: 1 }}>
          <Grid container item xs={12} sx={{ flexDirection: "row" }}>
            <Grid item xs={2} sx={{ borderBottom: "2px solid grey" }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Card</Typography>
            </Grid>
            <Grid item xs={2} sx={{ borderBottom: "2px solid grey" }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>List</Typography>
            </Grid>
            <Grid item xs={3} sx={{ borderBottom: "2px solid grey" }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Labels</Typography>
            </Grid>
            <Grid item xs={3} sx={{ borderBottom: "2px solid grey" }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Due date</Typography>
            </Grid>
            <Grid item xs={2} sx={{ borderBottom: "2px solid grey" }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Board</Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12} sx={{ flexDirection: "row", maxHeight: "50vh", overflow: "auto" }}>
            {filterCard(sortCard(cards, sortValue)).map((card) => (
              <CardItem key={card.card_id} card={card} />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserCard;
