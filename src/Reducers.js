import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  storedData: {},
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    storeData: (state, action) => {
      state.storedData = action.payload;
    },
  },
});

export const { storeData } = dataSlice.actions;

export default dataSlice.reducer;
