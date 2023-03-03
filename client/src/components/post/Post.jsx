import moment from "moment"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "../../context/auth"

import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  ButtonBase,
} from "@mui/material"
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt"
import DeleteIcon from "@mui/icons-material/Delete"
import ThumbUpAltOutlined from "@mui/icons-material/ThumbUpAltOutlined"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"

import * as api from "../../api/index"

import useStyles from "./styles"

const Post = ({ post, setCurrentId, page }) => {
  const classes = useStyles()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isUserPost = user?.result?._id === post.creator

  const likePostMutation = useMutation({
    mutationFn: api.likePost,
    onSuccess: ({ data }) => {
      queryClient.setQueryData(["posts", { page }], (oldData) => ({
        ...oldData,
        posts: [
          ...oldData.posts.map((el) =>
            el._id === data._id ? { ...data } : el
          ),
        ],
      }))
      queryClient.invalidateQueries(["posts"])
    },
  })

  const deletePostMutation = useMutation({
    mutationFn: api.deletePost,
    onSuccess: () => {
      queryClient.setQueryData(["posts", { page }], (oldData) => ({
        ...oldData,
        posts: oldData.posts.filter((el) => el._id !== post._id),
      }))
      queryClient.invalidateQueries(["posts"])
    },
  })

  const openPost = () => {
    navigate(`/posts/${post._id}`)
  }

  const Likes = () => {
    if (post?.likes?.length > 0) {
      return post.likes.find(
        (like) => like === (user?.result?.googleId || user?.result?._id)
      ) ? (
        <>
          <ThumbUpAltIcon fontSize="small" />
          &nbsp;
          {post.likes.length > 2
            ? `You and ${post.likes.length - 1} others`
            : `${post.likes.length} like${post.likes.length > 1 ? "s" : ""}`}
        </>
      ) : (
        <>
          <ThumbUpAltOutlined fontSize="small" />
          &nbsp;{post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
        </>
      )
    }

    return (
      <>
        <ThumbUpAltOutlined fontSize="small" />
        &nbsp;Like
      </>
    )
  }

  return (
    <Card className={classes.card}>
      <ButtonBase onClick={openPost}>
        <CardMedia
          className={classes.media}
          image={
            post.selectedFile ||
            "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
          }
          title={post.title}
        />
      </ButtonBase>
      <div className={classes.overlay}>
        <Typography variant="h6">{isUserPost ? "You" : post.name}</Typography>
        <Typography variant="body2">
          {moment(post.createdAt).fromNow()}
        </Typography>
      </div>
      <div className={classes.overlay2}>
        {user?.result?._id === post?.creator && (
          <Button
            style={{ color: "white" }}
            size="small"
            onClick={() => setCurrentId(post._id)}
          >
            <MoreHorizIcon fontSize="default" />
          </Button>
        )}
      </div>
      <div className={classes.details}>
        <Typography variant="body2" color="textSecondary" component="h2">
          {post.tags.map((tag) => `#${tag} `)}
        </Typography>
      </div>
      <Typography
        className={classes.title}
        gutterBottom
        variant="h5"
        component="h2"
      >
        {post.title}
      </Typography>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {post.message}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button
          size="small"
          color="primary"
          disabled={!user?.result}
          onClick={() => likePostMutation.mutate(post._id)}
        >
          <Likes />
        </Button>
        {post.creator === user?.result?._id && (
          <Button
            size="small"
            color="primary"
            onClick={() => deletePostMutation.mutate(post._id)}
          >
            <DeleteIcon fontSize="small" /> Delete
          </Button>
        )}
      </CardActions>
    </Card>
  )
}
export default Post
