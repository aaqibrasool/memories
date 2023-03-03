import { Link } from "react-router-dom"

import { Pagination, PaginationItem } from "@mui/material"

import useStyles from "./styles"

const Paginate = ({ page, totalPages }) => {
  const classes = useStyles()

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
