import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./Reducers";

export const store = configureStore({
  reducer: {
    DATA: dataReducer,
  },
});
