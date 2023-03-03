import { Routes, Route, Navigate } from "react-router-dom"

import { useAuth } from "./context/auth"

import Home from "./pages/home/Home"
import Auth from "./pages/auth/Auth"
import PostDetails from "./pages/postDetails/PostDetails"

import { Container } from "@mui/material"
import { Navbar } from "./components"

import { ThemeProvider } from "@mui/styles"
import { createTheme } from "@mui/material/styles"

const App = () => {
  const { user } = useAuth()
  let theme = createTheme()

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
