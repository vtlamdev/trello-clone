import React, { ChangeEvent, useEffect, useState } from "react";
import { Avatar, Button, Grid, Typography } from "@mui/material";
import { Textarea } from "@mui/joy";
import { CommentModel } from "../../../CardModel";

const CommentItem: React.FC<{
  comment_item: CommentModel;
  commentUpdate: (comment_id: string, content: string) => Promise<boolean | undefined>;
  commentDelete: (comment_id: string) => Promise<boolean | undefined>;
}> = ({ comment_item, commentUpdate, commentDelete }) => {
  const [content, setContent] = useState<string>(comment_item.content);
  const [editComment, setEditComment] = useState<boolean>(false);

  useEffect(() => {
    setContent(comment_item.content);
  }, [comment_item]);

  const handleEditComment = () => {
    setEditComment(true);
  };

  const handleEditCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSaveEditComment = async () => {
    const isCommentUpdate = await commentUpdate(comment_item.comment_id, content);
    if (isCommentUpdate) {
      setEditComment(false);
    } else {
    }
  };

  const handleCancelEditComment = () => {
    setEditComment(false);
    setContent(comment_item.content);
  };

  const handleDeleteComment = async () => {
    const isCommentDelete = await commentDelete(comment_item.comment_id);
    if (isCommentDelete) {
    } else {
    }
  };

  return (
    <Grid container item sx={{ flexDirection: "row", alignItems: "center" }}>
      <Grid item xs={1} sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignSelf: "flex-start" }}>
        <Avatar sx={{ bgcolor: "#BEB6F2", width: 30, height: 30, fontSize: 12, fontWeight: "bold" }}>{comment_item.user.username[0]?.toUpperCase()}</Avatar>
      </Grid>
      <Grid container item xs={11} sx={{ flexDirection: "column" }}>
        <Grid item sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontSize: 14, fontWeight: "600" }}>{comment_item.user.username}</Typography>
          <Typography sx={{ fontSize: 12 }}>{`${comment_item.created_at.slice(0, 10)} ${comment_item.created_at.slice(11, 20)}`}</Typography>
        </Grid>
        {!editComment ? (
          <Grid item container sx={{ flexDirection: "column", gap: 0.5 }}>
            <Grid item>
              <Typography sx={{ fontSize: 14 }}>{content}</Typography>
            </Grid>
            <Grid container item sx={{ flexDirection: "row", gap: 0.5 }}>
              <Button onClick={handleEditComment} size="small" variant="text" sx={{ fontSize: 12, textTransform: "none", textDecoration: "underline", height: 32 }}>
                Edit
              </Button>
              <Button onClick={handleDeleteComment} size="small" variant="text" sx={{ fontSize: 12, textTransform: "none", textDecoration: "underline", height: 32 }}>
                Delete
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid item container sx={{ flexDirection: "column", gap: 0.5 }}>
            <Grid item>
              <Textarea value={content} onChange={handleEditCommentChange} placeholder="Enter your comment..." sx={{ fontSize: 14, width: "100%" }} />
            </Grid>
            <Grid container item sx={{ flexDirection: "row", gap: 0.5 }}>
              <Button onClick={handleSaveEditComment} size="small" variant="contained" sx={{ height: 32, textTransform: "none", fontSize: 14 }}>
                Save
              </Button>
              <Button onClick={handleCancelEditComment} size="small" variant="text" sx={{ height: 32, textTransform: "none", fontSize: 14 }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default CommentItem;
