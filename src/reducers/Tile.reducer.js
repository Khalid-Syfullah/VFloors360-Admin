// src/reducers/Tile.reducer.js

import { DELETE_TILE, GET_TILE_DETAILS, GET_TILE_LIST } from "../constants/Type";

const initialState = {
  tiles: null,
  selected_tile: null,
  loading: true,
};

const tileReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_TILE_LIST:
      return {
        ...state,
        tiles: payload,
        loading: false,
      };
    case GET_TILE_DETAILS:
      return {
        ...state,
        selected_tile: payload,
        loading: false,
      };
    case DELETE_TILE:
      console.log("Tile deleted");
      return {
        ...state,
        tiles: {
          ...state.tiles,
          items: state.tiles.items.filter((tile) => tile._id !== payload),
        },
        loading: false,
      };
    default:
      return state;
  }
};

export default tileReducer;
