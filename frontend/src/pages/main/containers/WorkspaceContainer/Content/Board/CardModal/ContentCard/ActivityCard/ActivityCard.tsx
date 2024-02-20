import React, { ChangeEvent, useState } from "react";
import { Avatar, Button, Grid, Typography } from "@mui/material";
import Textarea from "@mui/joy/Textarea";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import CommentItem from "./CommentItem/CommentItem";
import { CommentModel } from "../../CardModel";
import { User } from "../../../../../../../WorkspaceContex/WorkspaceModel";
import { DecodeJWT } from "../../../../../../../../../base/helper/DecodeJWT";

const ActivityCard: React.FC<{
  comment: CommentModel[];
  commentAdd: (content: string) => Promise<boolean | undefined>;
  commentUpdate: (comment_id: string, content: string) => Promise<boolean | undefined>;
  commentDelete: (comment_id: string) => Promise<boolean | undefined>;
}> = ({ comment, commentAdd, commentUpdate, commentDelete }) => {
  const userInfo: User = DecodeJWT().data;

  const [newComment, setNewComment] = useState<string>("");

  const handleNewCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleCommentAdd = async () => {
    const isCommentAdd = await commentAdd(newComment);
    if (isCommentAdd) {
      setNewComment("");
    } else {
    }
  };

  return (
    <Grid container item sx={{ flexDirection: "column", gap: 2, marginBottom: 2 }}>
      <Grid container item sx={{ flexDirection: "row", alignItems: "center" }}>
        <Grid item xs={1}>
          <NotesOutlinedIcon sx={{ width: 25, height: 25 }} />
        </Grid>
        <Grid item xs={9}>
          <Typography sx={{ fontSize: 16 }}>Activity</Typography>
        </Grid>
        <Grid item xs={2} sx={{ display: "flex", justifyContent: "flex-end" }}></Grid>
      </Grid>
      <Grid container item sx={{ flexDirection: "row", alignItems: "center" }}>
        <Grid item xs={1} sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignSelf: "flex-start" }}>
          <Avatar sx={{ bgcolor: "#BEB6F2", width: 30, height: 30, fontSize: 12, fontWeight: "bold" }}>{userInfo.username[0]?.toUpperCase()}</Avatar>
        </Grid>
        <Grid container item xs={11} sx={{ flexDirection: "column", gap: 1 }}>
          <Grid>
            <Textarea value={newComment} onChange={handleNewCommentChange} placeholder="Enter your comment..." />
          </Grid>
          <Grid>
            {newComment != "" && (
              <Button onClick={handleCommentAdd} variant="contained" sx={{ fontSize: "14px", textTransform: "none" }}>
                Save
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
      {comment.map((comment_item) => (
        <CommentItem key={comment_item.comment_id} comment_item={comment_item} commentUpdate={commentUpdate} commentDelete={commentDelete} />
      ))}
    </Grid>
  );
};

export default ActivityCard;
