import { AUTH, LOGOUT } from '../constants/actionTypes';
import decode from "jwt-decode"
import * as api from '../../api/index.js';

export const signin = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);
    dispatch({ type: AUTH, data });
     router.push('/');
  } catch (error) {
  }
};

export const signup = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);
    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error) {
  }
};

export const checkUserAuthStatus = () => async (dispatch) => {
  try {
    const user = JSON.parse(localStorage.getItem("profile"))
    const token = user?.token
    if (token) {
      const decodedToken = decode(token)

      if (decodedToken.exp * 1000 < new Date().getTime()) {
        dispatch({ type: LOGOUT })
        return
      }
      dispatch({ type: AUTH, data:user })
    }
  } catch (error) {
    
  }
}