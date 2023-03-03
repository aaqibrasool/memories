import { createContext, useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import decode from "jwt-decode"

import * as api from "../api/index"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")))
  const navigate = useNavigate()

  const signIn = async (formData) => {
    try {
      const { data } = await api.signIn(formData)
      localStorage.setItem("profile", JSON.stringify({ ...data }))
      setUser(data)
      navigate("/")
    } catch (e) {
      console.log(e)
      setUser(null)
    }
  }

  const signUp = async (formData) => {
    try {
      const { data } = await api.signUp(formData)
      localStorage.setItem("profile", JSON.stringify({ ...data }))
      setUser(data)
      navigate("/")
    } catch (e) {
      console.log(e)
      setUser(null)
    }
  }

  const signOut = () => {
    localStorage.clear()
    setUser(null)
  }

  const value = {
    user,
    signIn,
    signUp,
    signOut,
  }

  useEffect(() => {
    const token = user?.token
    if (token) {
      const decodedToken = decode(token)
      if (decodedToken.exp * 1000 < new Date().getTime()) setUser(null)
    }
  }, [])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
