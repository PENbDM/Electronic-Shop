// orderSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

interface Order {
  id: number;
  totalquantity: number;
  totalprice: number;
  orderdate: string;
  products: Product[];
}

interface Product {
  id: number;
  name: string;
  price: string;
  rating: number;
  img: string;
  typeOfProductId: number;
  brandId: number;
}

interface OrderState {
  orders: Order[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData: any, { getState }) => {
    try {
      const { user } = getState() as RootState;
      const token = user.user.token;
      console.log(orderData);

      const response = await axios.post(
        "http://localhost:5000/api/order",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data as Order;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      throw error;
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (_, { getState }) => {
    try {
      const { user } = getState() as RootState;
      const token = user.user.token;
      const response = await axios.get("http://localhost:5000/api/order", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data as Order[];
    } catch (error) {
      console.error("Error fetching cart items:", error);
      throw error;
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [] as Order[], // Initialize as an empty array of Orders
    status: "idle",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;
