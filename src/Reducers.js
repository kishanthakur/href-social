import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  FORM_DATA: {},
  TOTAL_CUSTOM_LINKS: [],
  EDIT_PROFILE: false,
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
    STORE_EDIT_PROFILE_FLAG: (state, action) => {
      state.EDIT_PROFILE = action.payload;
    },
  },
});

export const {
  STORE_DATA_IN_STATE,
  STORE_TOTAL_CUSTOM_LINKS,
  STORE_EDIT_PROFILE_FLAG,
} = dataSlice.actions;

export default dataSlice.reducer;
