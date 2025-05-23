import axios from "axios";
import { toast } from "react-toastify";
import {
  ACCESS_TOKEN_ERROR,
  ACCESS_TOKEN_SUCCESS,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  AUTH_USER_LOAD,
  AUTH_USER_LOAD_ERROR,
  LOGOUT_FAIL,
} from "../constants/Type";
import { BASE_URL } from "../constants/URL";
import setAuthToken from "../utils/setAuthToken";

// SIGNUP ACTION
export const signup = (values) => async (dispatch) => {
  const formData = {
    name: values.name,
    username: values.username,
    password: values.password,
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };

  try {
    const res = await axios.post(
      `${BASE_URL}/api/v1/auth/signup`,
      JSON.stringify(formData),
      config
    );

    dispatch({
      type: SIGNUP_SUCCESS,
      payload: res.data,
    });

    toast.success("Account created successfully. You can now log in.");

    return true;
  } catch (err) {
    dispatch({
      type: SIGNUP_FAIL,
    });
    console.log(err);
    toast.error(err.response?.data?.message || "Signup failed.");
    return false;
  }
};

// LOGIN ACTION
export const login = (values) => async (dispatch) => {
  const formData = {
    username: values.username,
    password: values.password,
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };

  try {
    const res = await axios.post(
      `${BASE_URL}/api/v1/auth/login`,
      JSON.stringify(formData),
      config
    );

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    await dispatch(getRefreshToken());
    toast.success("Logged in successfully");
    return true;
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
    });
    console.log(err);
    toast.error(err.response?.data?.message || "Login failed.");
    return false;
  }
};

// LOGOUT ACTION
export const logout = () => async (dispatch) => {
  try {
    await axios.post(
      `${BASE_URL}/api/v1/auth/logout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    dispatch({
      type: LOGOUT_SUCCESS,
    });

    toast.success("Logged out successfully");
    window.location.href = '/'; // Redirect to home page

    return true;
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshSuccess = await dispatch(getRefreshToken());

      if (refreshSuccess) {
        try {
          await axios.post(
            `${BASE_URL}/api/v1/auth/logout`,
            {},
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );

          dispatch({
            type: LOGOUT_SUCCESS,
          });

          toast.success("Logged out successfully after token refresh");
          window.location.href = '/'; // Redirect to home page

          return true;
        } catch (logoutError) {
          dispatch({
            type: LOGOUT_FAIL,
          });

          toast.error("Logout failed after refreshing token.");
          window.location.href = '/'; // Redirect to home page

          return false;
        }
      } else {
        dispatch({
          type: LOGOUT_FAIL,
        });

        toast.error("Logout failed, and token refresh was not successful.");
        window.location.href = '/'; // Redirect to home page

        return false;
      }
    } else {
      dispatch({
        type: LOGOUT_FAIL,
      });

      toast.error("Logout error!");
      window.location.href = '/'; // Redirect to home page

      return false;
    }
  }
};

// GET PROFILE DATA
export const getProfileData = () => async (dispatch) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/v1/profile/`, {
      withCredentials: true,
    });

    dispatch({
      type: AUTH_USER_LOAD,
      payload: res.data.user,
    });

    return true;
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshSuccess = await dispatch(getRefreshToken());

      if (refreshSuccess) {
        try {
          const res = await axios.get(`${BASE_URL}/api/v1/profile/`, {
            withCredentials: true,
          });

          dispatch({
            type: AUTH_USER_LOAD,
            payload: res.data.user,
          });

          return true;
        } catch (profileError) {
          dispatch({
            type: AUTH_USER_LOAD_ERROR,
          });

          console.log(profileError);
          return false;
        }
      } else {
        dispatch({
          type: AUTH_USER_LOAD_ERROR,
        });

        console.log(error);
        return false;
      }
    } else {
      dispatch({
        type: AUTH_USER_LOAD_ERROR,
      });

      console.log(error);
      return false;
    }
  }
};

// GET REFRESH TOKEN
export const getRefreshToken = () => async (dispatch) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/auth/refresh-token`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    localStorage.setItem("token_book", response.data.accessToken);
    setAuthToken(response.data.accessToken);

    dispatch({
      type: ACCESS_TOKEN_SUCCESS,
      payload: response.data.accessToken,
    });

    await dispatch(getProfileData());

    return true;
  } catch (error) {
    dispatch({
      type: ACCESS_TOKEN_ERROR,
    });

    return false;
  }
};
