import { useState, useRef } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Typography, TextField, Button, Card } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"

import * as api from "../../api/index"

import useStyles from "./styles"

const CommentSection = ({ post }) => {
  const user = JSON.parse(localStorage.getItem("profile"))
  const [comment, setComment] = useState("")
  const classes = useStyles()
  const commentsRef = useRef()
  const queryClient = useQueryClient()

  const addCommentMutation = useMutation({
    mutationFn: api.comment,
    onSuccess: ({ data }) => {
      queryClient.setQueryData(["posts", post._id], data)
      setComment("")
      commentsRef?.current?.scrollIntoView({ behavior: "smooth" })
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: api.deleteComment,
    onSuccess: ({ data }) => {
      queryClient.setQueryData(["posts", post._id], data)
    },
  })

  const handleComment = async () =>
    addCommentMutation.mutate({
      comment: `${user?.result?.name}: ${comment}`,
      id: post._id,
    })

  const handleDeleteComment = async (postId, commentId) =>
    deleteCommentMutation.mutate({ postId, commentId })

  return (
    <div>
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer}>
          <Typography gutterBottom variant="h6">
            Comments
          </Typography>
          {post.comments.length > 0 &&
            post.comments?.map((el) => (
              <Card elevation={2} key={el?._id} className={classes.cardComment}>
                <Typography gutterBottom variant="subtitle1">
                  <strong>{el?.comment?.split(":")[0]}:</strong>
                  {el?.comment?.split(":")[1]}
                </Typography>
                {user &&
                  (user?.result?.googleId === el?.creator ||
                    user?.result?._id === el?.creator ||
                    user?.result.googleId === post.creator ||
                    user.result?._id === post.creator) && (
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => handleDeleteComment(post._id, el._id)}
                    >
                      <DeleteIcon fontSize="small" /> Delete
                    </Button>
                  )}
              </Card>
            ))}
          <div ref={commentsRef} />
        </div>
        {user && user?.result?.name && (
          <div style={{ width: "70%" }}>
            <Typography gutterBottom variant="h6">
              Write a comment
            </Typography>
            <TextField
              fullWidth
              rows={4}
              variant="outlined"
              label="Comment"
              multiline
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <br />
            <Button
              style={{ marginTop: "10px" }}
              fullWidth
              disabled={!comment.length}
              color="primary"
              variant="contained"
              onClick={handleComment}
            >
              Comment
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentSection
