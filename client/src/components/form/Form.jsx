import { useEffect, useState } from "react"
import useStyles from "./styles"
import {
  TextField,
  Button,
  Typography,
  Paper,
  Autocomplete,
  Chip,
  Checkbox,
} from "@mui/material"
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"
import CheckBoxIcon from "@mui/icons-material/CheckBox"
import FileBase from "react-file-base64"
import { useDispatch, useSelector } from "react-redux"
import { createPost, updatePost } from "../../redux/actions/posts"
import { useNavigate } from "react-router-dom"

const someTags = [
  "Film",
  "Tv-Show",
  "Vacation",
  "Tourism",
  "Travel-Diaries",
  "Event",
  "Sports",
  "Football",
  "Cricket",
  "Mma",
]
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

const Form = ({ currentId, setCurrentId }) => {
  const classes = useStyles()
  const [postData, setPostData] = useState({
    title: "",
    message: "",
    tags: [],
    selectedFile: "",
  })
  const post = useSelector((state) =>
    currentId ? state.posts.posts.find((p) => p._id === currentId) : null
  )
  const user = JSON.parse(localStorage.getItem("profile"))
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const clear = () => {
    setCurrentId(null)
    setPostData({ title: "", message: "", tags: [], selectedFile: "" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (currentId) {
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }))
    } else {
      dispatch(createPost({ ...postData, name: user?.result?.name }, navigate))
    }
    clear()
  }
  useEffect(() => {
    if (post) setPostData(post)
  }, [post])
  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please Sign In to create your own memories and like other's memories.
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper className={classes.paper} elevation={6}>
      <form
        autoComplete="off"
        noValidate
        className={`${classes.root} ${classes.form}`}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">Creating a Memory</Typography>
        <TextField
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <TextField
          name="message"
          variant="outlined"
          label="Message"
          fullWidth
          multiline
          rows={4}
          value={postData.message}
          onChange={(e) =>
            setPostData({ ...postData, message: e.target.value })
          }
        />
        <Autocomplete
          className={classes.tagsInput}
          fullWidth
          value={postData.tags}
          onChange={(event, newValue) => {
            setPostData((prevState) => ({
              ...prevState,
              tags: newValue,
            }))
          }}
          multiple
          id="tags-filled"
          options={someTags}
          getOptionLabel={(option) => option.title}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option}
            </li>
          )}
          freeSolo
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
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

        <div className={classes.fileInput}>
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          />
        </div>
        <Button
          className={classes.buttonSubmit}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          fullWidth
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={clear}
          fullWidth
        >
          Clear
        </Button>
      </form>
    </Paper>
  )
}
export default Form
