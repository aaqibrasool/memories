import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"

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
} from "@mui/material"
import Posts from "../../components/posts/Posts"
import Form from "../../components/form/Form"
import Pagination from "../../components/pagination/Pagination"

import { getPostsBySearchAndTags } from "../../redux/actions/posts"

import useStyles from "./styles"

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const Home = () => {
  const [currentId, setCurrentId] = useState(0)
  const dispatch = useDispatch()
  const classes = useStyles()
  const query = useQuery()
  const page = query.get("page") || 1
  const searchQuery = query.get("searchQuery")
  const [search, setSearch] = useState("")
  const [tags, setTags] = useState([])
  const navigate = useNavigate()

  const searchPost = () => {
    if (search.trim() || tags.length) {
      //console.log(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`)
      dispatch(getPostsBySearchAndTags({ search, tags: tags.join(",") }))
      navigate(
        `/posts/search?searchQuery=${search || "none"}&tags=${tags.join(",")}`
      )
    } else {
      navigate("/")
    }
  }
  console.log(tags)

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
            <Posts setCurrentId={setCurrentId} />
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
            {!searchQuery && !tags.length && (
              <Paper className={classes.pagination} elevation={6}>
                <Pagination page={page} />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  )
}

export default Home
