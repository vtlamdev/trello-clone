import React from "react";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import CardModel from "../UserCardModel";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useAllWorkspaceContext } from "../../../WorkspaceContex/WorkspaceContex";
import { WorkspaceDataModel } from "../../../WorkspaceContex/WorkspaceModel";

const CardItem: React.FC<{ card: CardModel }> = ({ card }) => {
  const { allWorkspace } = useAllWorkspaceContext();

  const findWorkSpaceId = (boardId: string) => {
    const result = allWorkspace?.data.find((element: WorkspaceDataModel) => {
      const board = element.boards.find((board) => {
        if (board.board_id == boardId) return true;
        else return false;
      });
      if (board) return true;
      else return false;
    });
    if (result) return result.workspace_id;
    else return "";
  };

  return (
    <Grid container item sx={{ flexDirection: "row", alignItems: "center", borderBottom: "2px solid lightgrey", paddingBottom: 1, paddingTop: 1 }}>
      <Grid item xs={2}>
        <Link to={`/page/workspace/${findWorkSpaceId(card.board.board_id)}/board/${card.board.board_id}/card/${card.card_id}`}>
          <Button size="small" sx={{ fontSize: 14, width: "100%", textTransform: "none", color: "black", justifyContent: "left" }}>
            {card.name}
          </Button>
        </Link>
      </Grid>
      <Grid item xs={2}>
        <Typography sx={{ fontSize: 14 }}>{card.list.title}</Typography>
      </Grid>
      <Grid container item xs={3} sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
        {card.label.map((label) => (
          <Box key={label.label_id} sx={{ backgroundColor: `${label.value || "grey"}`, width: 60, padding: 1, borderRadius: 1 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, textAlign: "center", textOverflow: "ellipsis", overflow: "hidden" }}>{label.title}</Typography>
          </Box>
        ))}
      </Grid>
      <Grid container item xs={3} sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
        {card.is_completed ? (
          <IconButton onClick={() => {}} sx={{ padding: 0 }}>
            <CheckBoxOutlinedIcon sx={{ width: 25, height: 25 }} />
          </IconButton>
        ) : card.due_date != "" ? (
          <IconButton onClick={() => {}} sx={{ padding: 0 }}>
            <CheckBoxOutlineBlankOutlinedIcon sx={{ width: 25, height: 25 }} />
          </IconButton>
        ) : (
          <></>
        )}

        {card.is_completed ? (
          <Typography sx={{ fontSize: 12, backgroundColor: "green", color: "white", borderRadius: "5px", padding: "5px", fontWeight: 600 }}>{`${card.due_date}`}</Typography>
        ) : Date.now() - Date.parse(dayjs(card.due_date, "DD/MM/YYYY, HH:mm:ss").format("YYYY/MM/DD, HH:mm:ss")) > 0 ? (
          <Typography sx={{ fontSize: 12, backgroundColor: "brown", color: "white", borderRadius: "5px", padding: "5px", fontWeight: 600 }}>{`${card.due_date}`}</Typography>
        ) : (
          <Typography sx={{ fontSize: 12, borderRadius: "5px", padding: "5x", fontWeight: 600 }}>{`${card.due_date}`}</Typography>
        )}
      </Grid>
      <Grid container item xs={2}>
        <Link to={`/page/workspace/${findWorkSpaceId(card.board.board_id)}/board/${card.board.board_id}`}>
          <Grid container sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <Grid item>
              <Box key={card.board.board_id} sx={{ backgroundColor: "salmon", width: 35, height: 35, borderRadius: "2px" }}></Box>
            </Grid>
            <Grid item>
              <Typography sx={{ fontSize: 12, fontWeight: 600, textAlign: "center", display: "inline" }}>{card.board.title}</Typography>
            </Grid>
          </Grid>
        </Link>
      </Grid>
    </Grid>
  );
};

export default CardItem;
