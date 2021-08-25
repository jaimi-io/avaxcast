import { combineReducers } from "redux";
import darkReducer from "./isDark";

const allReducers = combineReducers({
  isDark: darkReducer,
});

export default allReducers;
