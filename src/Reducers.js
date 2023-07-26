import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  FORM_DATA: {},
  TOTAL_CUSTOM_LINKS: {},
  EDIT_PROFILE: false,
  PREVIEW: false,
  IMAGE: "",
  DB_DATA: {},
  VERIFY_KEY: false,
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
    STORE_PREVIEW_FLAG: (state, action) => {
      state.PREVIEW = action.payload;
    },
    STORE_IMAGE_URL: (state, action) => {
      state.IMAGE = action.payload;
    },
    STORE_DB_DATA: (state, action) => {
      state.DB_DATA = action.payload;
    },
    UPDATE_FORM_DATA: (state, action) => {
      state.FORM_DATA[action.payload.key] = action.payload.value;
    },
    STORE_VERIFY_KEY_FLAG: (state, action) => {
      state.VERIFY_KEY = action.payload;
    },
  },
});

export const {
  STORE_DATA_IN_STATE,
  STORE_TOTAL_CUSTOM_LINKS,
  STORE_EDIT_PROFILE_FLAG,
  STORE_PREVIEW_FLAG,
  STORE_IMAGE_URL,
  STORE_DB_DATA,
  UPDATE_FORM_DATA,
  STORE_VERIFY_KEY_FLAG,
} = dataSlice.actions;

export default dataSlice.reducer;
