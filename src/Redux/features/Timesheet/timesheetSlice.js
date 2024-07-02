import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  BASE_URL,
  TIME_SHEET_LIST,
  DELETE_TIMESHEET,
  DELETE_BREAK,
} from "../../../Constants/Config";

const initialState = {
  loading: false,
  timeSheetData: [],
  successMessage: "",
  error: "",
};

// Generate pening , fulfilled and rejected action type

export const fetchtimeSheetData = createAsyncThunk(
  "timeSheet/fetchtimeSheetData",
  async (data) => {
    const { token, ...newData } = data;
    try {
      const response = await axios.post(BASE_URL + TIME_SHEET_LIST, newData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === true) {
        return response.data.data;
      } else if (response.data.status === false) {
        return response.data;
      }
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// Generate pening , fulfilled and rejected action type

export const deleteTimesheet = createAsyncThunk(
  "timeSheet/deleteTimesheet",
  async (data) => {
    const { token, ...newData } = data;
    try {
      const response = await axios.post(BASE_URL + DELETE_TIMESHEET, newData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        console.log(response);
        return {
          categoryId: data.attendanceid,
        };
      }
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const deleteBreak = createAsyncThunk(
  "timeSheet/deleteBreak",
  async (data) => {
    const { token, ...newData } = data;
    try {
      const response = await axios.post(BASE_URL + DELETE_BREAK, newData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        console.log(response);
        return {
          categoryId: data.id,
        };
      }
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

const timeSheetSlice = createSlice({
  name: "timeSheet",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchtimeSheetData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchtimeSheetData.fulfilled, (state, action) => {
      state.loading = false;
      state.timeSheetData = action.payload;
      state.error = "";
    });
    builder.addCase(fetchtimeSheetData.rejected, (state, action) => {
      state.loading = false;
      state.timeSheetData = {};
      state.error = action.error.message;
    });

    // for DeleteTimeAll sheet
    builder.addCase(deleteTimesheet.pending, (state) => {
      state.loading = true;
    });
    // builder.addCase(deleteTimesheet.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.successMessage = action.payload.message;
    //     state.timeSheetData = state.timeSheetData.filter((item) => item && item.id !== action.payload.categoryId);
    //     state.error = ''; // Reset the error message
    // });
    builder.addCase(deleteTimesheet.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload.message;
      state.timeSheetData = Array.isArray(state.timeSheetData)
        ? state.timeSheetData.filter(
            (item) => item && item.id !== action.payload.categoryId
          )
        : [];
      state.error = "";
    });
    builder.addCase(deleteTimesheet.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // for Deletebreak sheet
    builder.addCase(deleteBreak.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteBreak.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload.message;
      state.timeSheetData = Array.isArray(state.timeSheetData)
        ? state.timeSheetData.filter(
            (item) => item && item.id !== action.payload.categoryId
          )
        : [];
      state.error = ""; // Reset the error message
    });
    builder.addCase(deleteBreak.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default timeSheetSlice.reducer;
