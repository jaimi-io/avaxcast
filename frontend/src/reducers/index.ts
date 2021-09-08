import { combineReducers } from "redux";
import darkReducer from "./isDark";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import marketFilterReducer from "./marketFilter";

/**
 * Combination of all the reducers
 */
const allReducers = combineReducers({
  isDark: darkReducer,
  marketFilter: marketFilterReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

/**
 * The root persistent reducer
 */
const rootReducer = persistReducer(persistConfig, allReducers);
export default rootReducer;
