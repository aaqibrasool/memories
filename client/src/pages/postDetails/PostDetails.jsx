import moment from "moment"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { Paper, Typography, CircularProgress, Divider } from "@mui/material"
import CommentSection from "./CommentSection"

import * as api from "../../api/index"

import useStyles from "./styles"

const PostDetails = () => {
  const navigate = useNavigate()
  const classes = useStyles()
  const { id } = useParams()

  const {
    isLoading: loadingPost,
    data: dataPost,
    error: errorPost,
  } = useQuery({
    queryKey: ["posts", id],
    queryFn: async () => {
      const { data } = await api.fetchPost(id)
      return data
    },
  })

  const {
    isLoading: loadingRecommendedPosts,
    data: dataRecommendedPosts,
    error: errorRecommendedPosts,
  } = useQuery({
    queryKey: ["posts", id, "recommendedPosts"],
    queryFn: async () => {
      const { data } = await api.fetchPostsBySearch({
        search: "",
        tags: dataPost?.tags?.join(","),
      })
      return data
    },
    enabled: Boolean(dataPost),
  })

  const openPost = (_id) => navigate(`/posts/${_id}`)

  if (loadingPost) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    )
  }

  return (
    <Paper style={{ padding: "20px", borderRadius: "15px" }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">
            {dataPost.title}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            color="textSecondary"
            component="h2"
          >
            {dataPost.tags.map((tag) => `#${tag} `)}
          </Typography>
          <Typography gutterBottom variant="body1" component="p">
            {dataPost.message}
          </Typography>
          <Typography variant="h6">Created by: {dataPost.name}</Typography>
          <Typography variant="body1">
            {moment(dataPost.createdAt).fromNow()}
          </Typography>
          <Divider style={{ margin: "20px 0" }} />
          <CommentSection post={dataPost} />
          <Divider style={{ margin: "20px 0" }} />
        </div>
        <div className={classes.imageSection}>
          <img
            className={classes.media}
            src={
              dataPost.selectedFile ||
              "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
            }
            alt={dataPost.title}
          />
        </div>
      </div>
      <div className={classes.section}>
        <Typography gutterBottom variant="h5">
          You might also like:
        </Typography>
        <Divider />
        {!loadingRecommendedPosts ? (
          <div className={classes.recommendedPosts}>
            {dataRecommendedPosts.posts
              .filter((el) => el._id !== dataPost._id)
              .map(({ title, name, message, likes, selectedFile, _id }) => (
                <div
                  style={{ margin: "20px", cursor: "pointer" }}
                  onClick={() => openPost(_id)}
                  key={_id}
                >
                  <Typography gutterBottom variant="h6">
                    {title}
                  </Typography>
                  <Typography gutterBottom variant="subtitle2">
                    {name}
                  </Typography>
                  <Typography gutterBottom variant="subtitle2">
                    {message}
                  </Typography>
                  <Typography gutterBottom variant="subtitle1">
                    Likes: {likes.length}
                  </Typography>
                  <img src={selectedFile} width="200px" alt={title} />
                </div>
              ))}
          </div>
        ) : (
          <CircularProgress color="secondary" />
        )}
      </div>
    </Paper>
  )
}

export default PostDetails
