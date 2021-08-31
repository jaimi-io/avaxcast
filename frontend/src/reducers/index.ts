import { combineReducers } from "redux";
import darkReducer from "./isDark";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const allReducers = combineReducers({
  isDark: darkReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = persistReducer(persistConfig, allReducers);
export default rootReducer;
