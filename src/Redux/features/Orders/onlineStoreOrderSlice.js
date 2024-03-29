import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  BASE_URL,
  LIST_ALL_STORE_ORDER_LIST,
  UPDATE_ORDER_STATUS,
} from "../../../Constants/Config";

const initialState = {
  loading: false,
  onlineStoreOrderData: [],
  OrderChangeStatusData: [],
  successMessage: "",
  error: "",
};

// Generate pening , fulfilled and rejected action type
export const fetchOnlieStoreOrderData = createAsyncThunk(
  "onlineStoreOrder/fetchOnlieStoreOrderData.",
  async (data) => {
    try {
      const response = await axios.post(
        BASE_URL + LIST_ALL_STORE_ORDER_LIST,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      // console.log(response)
      if (response.data.status === true) {
        return response.data.order_data;
      }
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const fetchOrderChangeStatusData = createAsyncThunk(
  "onlineStoreOrder/fetchOrderChangeStatusData.",
  async (data) => {
    try {
      const response = await axios.post(BASE_URL + UPDATE_ORDER_STATUS, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response);
      if (response.data.status === true) {
        return response.data.message;
      }
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

const onlineStoreOrderSlice = createSlice({
  name: "onlineStoreOrder",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchOnlieStoreOrderData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOnlieStoreOrderData.fulfilled, (state, action) => {
      state.loading = false;
      state.onlineStoreOrderData = action.payload;
      state.error = "";
    });
    builder.addCase(fetchOnlieStoreOrderData.rejected, (state, action) => {
      state.loading = false;
      state.onlineStoreOrderData = {};
      state.error = action.error.message;
    });
    // for Chnage order status
    builder.addCase(fetchOrderChangeStatusData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOrderChangeStatusData.fulfilled, (state, action) => {
      state.loading = false;
      state.OrderChangeStatusData = action.payload;
      state.error = "";
    });
    builder.addCase(fetchOrderChangeStatusData.rejected, (state, action) => {
      state.loading = false;
      state.OrderChangeStatusData = {};
      state.error = action.error.message;
    });
  },
});

export default onlineStoreOrderSlice.reducer;
