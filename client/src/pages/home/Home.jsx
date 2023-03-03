import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import {
  Container,
  Grow,
  Grid,
  AppBar,
  TextField,
  Button,
  Paper,
  Chip,
  Autocomplete,
  CircularProgress,
} from "@mui/material"
import { Form, Pagination, Post } from "../../components"

import * as api from "../../api/index"

import useStyles from "./styles"

function useQueryA() {
  return new URLSearchParams(useLocation().search)
}

const Home = () => {
  const [currentId, setCurrentId] = useState(0)
  const classes = useStyles()
  const query = useQueryA()
  const page = Number(query.get("page")) || 1
  const searchQuery = query.get("searchQuery")
  const tagsQuery = query.get("tags")
  const [search, setSearch] = useState("")
  const [tags, setTags] = useState([])
  const navigate = useNavigate()

  const enableSearchQuery = searchQuery || tagsQuery

  const allPostsQuery = useQuery({
    queryKey: ["posts", { page }],
    queryFn: async () => {
      const { data } = await api.fetchPosts(page)
      return data
    },
    enabled: Boolean(!enableSearchQuery),
  })

  const searchPostsQuery = useQuery({
    queryKey: ["posts", { searchQuery, tagsQuery }],
    queryFn: async () => {
      const { data } = await api.fetchPostsBySearch({
        search: searchQuery,
        tags: tagsQuery,
      })
      return data
    },
    enabled: Boolean(enableSearchQuery),
  })

  const data = enableSearchQuery ? searchPostsQuery.data : allPostsQuery.data
  const isLoading = enableSearchQuery
    ? searchPostsQuery.isLoading
    : allPostsQuery.isLoading

  const searchPost = () => {
    if (search.trim() || tags.length) {
      navigate(`/posts/search?searchQuery=${search}&tags=${tags.join(",")}`)
    } else {
      navigate("/")
    }
  }

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost()
    }
  }

  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid
          container
          justify="space-between"
          alignItems="stretch"
          spacing={3}
          className={classes.gridContainer}
        >
          <Grid item xs={12} sm={6} md={9}>
            {isLoading ? (
              <CircularProgress color="secondary" />
            ) : (
              <Grid
                className={classes.container}
                container
                alignItems="stretch"
                spacing={3}
              >
                {data.posts.map((post) => (
                  <Grid key={post._id} item xs={12} sm={12} md={6} lg={3}>
                    <Post post={post} setCurrentId={setCurrentId} page={page} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar
              className={classes.appBarSearch}
              position="static"
              color="inherit"
            >
              <TextField
                onKeyDown={handleKeyPress}
                name="search"
                variant="outlined"
                label="Search Memories"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Autocomplete
                sx={{ margin: "16px 0" }}
                className={classes.tagsInput}
                fullWidth
                value={tags}
                onChange={(event, newValue) => {
                  setTags(newValue)
                }}
                multiple
                id="tags-filled"
                options={tags}
                freeSolo
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={index}
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Tags"
                    placeholder="Search"
                  />
                )}
              />
              <Button
                onClick={searchPost}
                className={classes.searchButton}
                variant="contained"
                color="primary"
              >
                Search
              </Button>
            </AppBar>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
            {!searchQuery && !tagsQuery && (
              <Paper className={classes.pagination} elevation={6}>
                <Pagination page={page} totalPages={data?.totalPages || 1} />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  )
}

export default Home
