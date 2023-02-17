import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { AppBar, Typography, Toolbar, Avatar, Button } from "@mui/material"

import memoriesLogo from "../../images/memoriesLogo.png"
import memoriesText from "../../images/memoriesText.png"
import useStyles from "./styles"

const Navbar = () => {
  const user = useSelector((state) => state.authReducer.authData)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const classes = useStyles()

  const logout = () => {
    dispatch({ type: "LOGOUT" })
    setUser(null)
    navigate("/")
  }

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <Link to="/" className={classes.brandContainer}>
        <img
          component={Link}
          to="/"
          src={memoriesText}
          alt="icon"
          height="45px"
        />
        <img
          className={classes.image}
          src={memoriesLogo}
          alt="icon"
          height="40px"
        />
      </Link>
      <Toolbar className={classes.toolbar}>
        {user?.result ? (
          <div className={classes.profile}>
            <Avatar
              className={classes.purple}
              alt={user?.result.name}
              src={user?.result.imageUrl}
            >
              {user?.result.name.charAt(0)}
            </Avatar>
            <Typography className={classes.userName} variant="h6">
              {user?.result.name}
            </Typography>
            <Button
              variant="contained"
              className={classes.logout}
              color="secondary"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            component={Link}
            to="/auth"
            variant="contained"
            color="primary"
          >
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
