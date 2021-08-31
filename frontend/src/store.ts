import { createStore } from "redux";
import { persistStore } from "redux-persist";
import rootReducer from "reducers/";

const store = createStore(rootReducer);
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
