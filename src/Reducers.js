import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  FORM_DATA: {},
  TOTAL_CUSTOM_LINKS: [],
};

export const dataSlice = createSlice({
  name: "DATA",
  initialState,
  reducers: {
    STORE_DATA_IN_STATE: (state, action) => {
      state.FORM_DATA = action.payload;
    },
    STORE_TOTAL_CUSTOM_LINKS: (state, action) => {
      state.TOTAL_CUSTOM_LINKS = action.payload;
    },
  },
});

export const { STORE_DATA_IN_STATE, STORE_TOTAL_CUSTOM_LINKS } =
  dataSlice.actions;

export default dataSlice.reducer;
