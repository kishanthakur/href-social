import { configureStore } from "@reduxjs/toolkit";
import storeDataReducer from "./Reducers";

export const store = configureStore({
  reducer: {
    data: storeDataReducer,
  },
});
