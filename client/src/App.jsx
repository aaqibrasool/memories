import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Routes, Route, Navigate } from "react-router-dom"

import Home from "./pages/home/Home"
import Auth from "./pages/auth/Auth"
import PostDetails from "./pages/postDetails/PostDetails"

import { Container } from "@mui/material"
import Navbar from "./components/nav/Navbar"

import { checkUserAuthStatus } from "./redux/actions/auth"

import { ThemeProvider } from "@mui/styles"
import { createTheme } from "@mui/material/styles"

const App = () => {
  const user = useSelector((state) => state.authReducer.authData)
  const dispatch = useDispatch()
  let theme = createTheme()

  useEffect(() => {
    dispatch(checkUserAuthStatus())
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl">
        <Navbar user={user} />
        <Routes>
          <Route exact path="/" element={user ? <Home /> : <Auth />} />
          <Route path="/posts" element={<Home />} />
          <Route path="/posts/search" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route
            path="/auth"
            element={!user ? <Auth /> : <Navigate to="/posts" replace={true} />}
          />
        </Routes>
      </Container>
    </ThemeProvider>
  )
}

export default App
