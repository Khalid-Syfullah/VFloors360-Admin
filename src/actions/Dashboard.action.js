import axios from "axios";
import { GET_DASHBOARD_DATA } from "../constants/Type";
import { BASE_URL } from "../constants/URL";
import { getRefreshToken } from "./Auth.action";

// GET DASHBOARD DATA
export const getDashboardData = () => async (dispatch) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/v1/dashboard`, {
      withCredentials: true,
    });

    console.log("Dashboard", res);

    dispatch({
      type: GET_DASHBOARD_DATA,
      payload: res.data.data,
    });

    return true;
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshSuccess = await dispatch(getRefreshToken());

      if (refreshSuccess) {
        try {
          const res = await axios.get(`${BASE_URL}/api/v1/dashboard`, {
            withCredentials: true,
          });

          console.log("Dashboard after refresh", res);

          dispatch({
            type: GET_DASHBOARD_DATA,
            payload: res.data.data,
          });

          return true;
        } catch (retryError) {
          console.log(retryError);
          return false;
        }
      } else {
        console.log("Token refresh failed");
        return false;
      }
    } else {
      console.log(error);
      return false;
    }
  }
};
