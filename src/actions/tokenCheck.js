import { getRefreshToken, logout } from "./Auth.action";

const tokenHandeler = (err, cb) => async (dispatch) => {
  if (err.response.status === 401) {
    let check = await dispatch(getRefreshToken());
    if (check === false) {
      dispatch(logout());
    } else {
      dispatch(cb());
    }
  }
  return true;
};

export default tokenHandeler;
