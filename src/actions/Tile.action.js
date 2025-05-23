import axios from "axios";
import { toast } from "react-toastify";
import {
  GET_TILE_LIST,
  GET_TILE_DETAILS,
  CREATE_TILE,
  UPDATE_TILE,
  DELETE_TILE,
  CREATE_TILE_ERROR,
  UPDATE_TILE_ERROR,
  DELETE_TILE_ERROR,
  GET_TILE_DETAILS_ERROR,
} from "../constants/Type"; // Make sure the constants are updated as per your needs
import { BASE_URL } from "../constants/URL";
import { getRefreshToken } from "./Auth.action";

// GET TILE LIST
export const getTileList = (page) => async (dispatch) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/v1/tile?page=${page}&limit=9999999`);

    console.log('Get Tiles Response:', res);

    dispatch({
      type: GET_TILE_LIST,
      payload: res.data.tiles,
    });

    return true;
  } catch (err) {
    if (err.response?.status === 401) {
      const refreshSuccess = await dispatch(getRefreshToken());

      if (refreshSuccess) {
        try {
          const res = await axios.get(`${BASE_URL}/api/v1/tile?page=${page}&limit=9999999`);
          
          dispatch({
            type: GET_TILE_LIST,
            payload: res.data.tiles,
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
      console.log(err);
      return false;
    }
  }
};

// GET TILE DETAILS
export const getTileDetails = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/v1/tile/${id}`);

    dispatch({
      type: GET_TILE_DETAILS,
      payload: res.data.tile,
    });

    return true;
  } catch (err) {
    if (err.response?.status === 401) {
      const refreshSuccess = await dispatch(getRefreshToken());

      if (refreshSuccess) {
        try {
          const res = await axios.get(`${BASE_URL}/api/v1/tile/${id}`);

          dispatch({
            type: GET_TILE_DETAILS,
            payload: res.data.tile,
          });

          return true;
        } catch (retryError) {
          dispatch({
            type: GET_TILE_DETAILS_ERROR,
          });
          console.log(retryError);
          return false;
        }
      } else {
        dispatch({
          type: GET_TILE_DETAILS_ERROR,
        });
        console.log("Token refresh failed");
        return false;
      }
    } else {
      dispatch({
        type: GET_TILE_DETAILS_ERROR,
      });
      console.log(err);
      return false;
    }
  }
};

// CREATE TILE
export const createTile = (values, image) => async (dispatch) => {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("size", values.size);
  formData.append("areaCoverage", values.areaCoverage);
  formData.append("price", values.price);
  formData.append("category", values.category);
  formData.append("brand", values.brand || "TPT"); // Default to 'TPT' if not provided

  if (image) {
    formData.append("image", image);
  }

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  };

  try {
    await axios.post(`${BASE_URL}/api/v1/tile`, formData, config);

    dispatch({
      type: CREATE_TILE,
    });

    dispatch(getTileList(1));

    return true;
  } catch (err) {
    if (err.response?.status === 401) {
      const refreshSuccess = await dispatch(getRefreshToken());

      if (refreshSuccess) {
        try {
          await axios.post(`${BASE_URL}/api/v1/tile`, formData, config);

          dispatch({
            type: CREATE_TILE,
          });

          dispatch(getTileList(1)); // Refresh the tile list after creation

          return true;
        } catch (retryError) {
          dispatch({
            type: CREATE_TILE_ERROR,
          });
          console.log(retryError);
          return false;
        }
      } else {
        dispatch({
          type: CREATE_TILE_ERROR,
        });
        console.log("Token refresh failed");
        return false;
      }
    } else {
      dispatch({
        type: CREATE_TILE_ERROR,
      });
      console.log(err);
      return false;
    }
  }
};

// UPDATE TILE
export const updateTile = (values, image, id) => async (dispatch) => {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("size", values.size);
  formData.append("areaCoverage", values.areaCoverage);
  formData.append("price", values.price);
  formData.append("category", values.category);
  formData.append("brand", values.brand || "TPT"); // Default to 'TPT' if not provided

  if (image) {
    formData.append("image", image);
  }

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  };

  try {
    await axios.patch(`${BASE_URL}/api/v1/tile/${id}`, formData, config);

    dispatch({
      type: UPDATE_TILE,
    });

    dispatch(getTileList(1)); // Refresh the tile list after update

    return true;
  } catch (err) {
    if (err.response?.status === 401) {
      const refreshSuccess = await dispatch(getRefreshToken());

      if (refreshSuccess) {
        try {
          await axios.patch(`${BASE_URL}/api/v1/tile/${id}`, formData, config);

          dispatch({
            type: UPDATE_TILE,
          });

          dispatch(getTileList(1)); // Refresh the tile list after update

          return true;
        } catch (retryError) {
          dispatch({
            type: UPDATE_TILE_ERROR,
          });
          console.log(retryError);
          return false;
        }
      } else {
        dispatch({
          type: UPDATE_TILE_ERROR,
        });
        console.log("Token refresh failed");
        return false;
      }
    } else {
      dispatch({
        type: UPDATE_TILE_ERROR,
      });
      console.log(err);
      return false;
    }
  }
};

// DELETE TILE
export const deleteTile = (id) => async (dispatch) => {
  try {
    await axios.delete(`${BASE_URL}/api/v1/tile/${id}`, {
      withCredentials: true,
    });

    dispatch({
      type: DELETE_TILE,
      payload: id,
    });

    dispatch(getTileList(1)); // Refresh the tile list after deletion

    return true;
  } catch (err) {
    if (err.response?.status === 401) {
      const refreshSuccess = await dispatch(getRefreshToken());

      if (refreshSuccess) {
        try {
          await axios.delete(`${BASE_URL}/api/v1/tile/${id}`, {
            withCredentials: true,
          });

          dispatch({
            type: DELETE_TILE,
            payload: id,
          });

          dispatch(getTileList(1)); // Refresh the tile list after deletion

          return true;
        } catch (retryError) {
          dispatch({
            type: DELETE_TILE_ERROR,
          });
          console.log(retryError);
          return false;
        }
      } else {
        dispatch({
          type: DELETE_TILE_ERROR,
        });
        console.log("Token refresh failed");
        return false;
      }
    } else {
      dispatch({
        type: DELETE_TILE_ERROR,
      });
      console.log(err);
      return false;
    }
  }
};
