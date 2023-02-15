import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { Pagination, PaginationItem } from "@mui/material"
import useStyles from "./styles"
import { useDispatch, useSelector } from "react-redux"
import { getPosts } from "../../redux/actions/posts"

const Paginate = ({ page }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { totalPages } = useSelector((state) => state.posts)

  useEffect(() => {
    if (page) dispatch(getPosts(page))
  }, [page, dispatch])

  return (
    <Pagination
      classes={{ ul: classes.ul }}
      count={totalPages}
      page={Number(page) || 1}
      variant="outlined"
      color="primary"
      renderItem={(item) => (
        <PaginationItem
          {...item}
          component={Link}
          to={`/posts?page=${item.page}`}
        />
      )}
    />
  )
}

export default Paginate
