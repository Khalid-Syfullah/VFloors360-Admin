import { combineReducers } from "redux";
import authReducer from "./Auth.reducer";
import tileReducer from "./Tile.reducer";

const reducer = combineReducers({
  auth: authReducer,
  tile: tileReducer,

});

export default reducer;
