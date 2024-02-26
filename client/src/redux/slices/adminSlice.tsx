// adminSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Root } from "react-dom/client";
import { RootState } from "../store";
import { URL_ELEPHANT } from "../../utils/url";

interface Product {
  name: string;
  price: string;
  rating: number;
  img: string;
  typeOfProductId: number;
  brandId: number;
}
interface ProductTOCreate {
  name: string;
  price: string;
  rating: number;
  img: string;
  typeOfProductId: number;
  brandId: number;
  description: { title: string; description: string }[];
}
interface AdminState {
  brands: string[];
  products: Product[];
  loading: boolean;
}

const initialState: AdminState = {
  brands: [],
  products: [],
  loading: false,
};

export const fetchAllBrands = createAsyncThunk(
  "admin/fetchAllBrands",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${URL_ELEPHANT}/api/brand`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// adminSlice.ts
export const createBrand = createAsyncThunk(
  "admin/createBrand",
  async (brandName: string, { rejectWithValue, getState }) => {
    try {
      const { user } = getState() as RootState;
      const token = user.user.token;

      const { data } = await axios.post(
        `${URL_ELEPHANT}/api/brand`,
        { name: brandName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (productData: Product, { rejectWithValue, getState }) => {
    try {
      const { user } = getState() as RootState;
      const token = user.user.token;

      const { data } = await axios.post(
        `${URL_ELEPHANT}/api/product`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBrands.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchAllBrands.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(createBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands.push(action.payload); // Assuming the response contains the created brand
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming the response contains the created product
        // If not, adjust accordingly
        if (action.payload) {
          state.products.push(action.payload);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default adminSlice.reducer;
