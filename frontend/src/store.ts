import allReducers from "reducers/";
import { createStore } from "redux";

const store = createStore(allReducers);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
