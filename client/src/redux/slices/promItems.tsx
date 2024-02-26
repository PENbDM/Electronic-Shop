import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { URL_ELEPHANT } from "../../utils/url";
interface Product {
  id: number;
  name: string;
  price: string;
  rating: number;
  img: string;
  typeOfProductId: number;
  brandId: number;
}

interface Type {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}
interface PromItemsState {
  items: Product[];
  type_of_products: Type[];
  brands: Brand[];
  status: "loading" | "succeeded" | "failed";
}

const initialState: PromItemsState = {
  items: [],
  type_of_products: [],
  brands: [],
  status: "loading",
};

export const fetchAllProducts = createAsyncThunk(
  "promItems/fetchAllProducts",
  async () => {
    try {
      const response = await axios.get(`${URL_ELEPHANT}/api/product`);
      return response.data.rows as Product[];
    } catch (error) {
      console.error("Error fetching laptops:", error);
      throw error;
    }
  }
);

export const fetchAllTypes = createAsyncThunk(
  "promItems/fetchAllTypes",
  async () => {
    try {
      const response = await axios.get(`${URL_ELEPHANT}/api/type`);

      return response.data as Type[];
    } catch (error) {
      console.error("Error fetching laptops:", error);
      throw error;
    }
  }
);

export const fetchAllBrands = createAsyncThunk(
  "promItems/fetchAllBrands",
  async () => {
    try {
      const response = await axios.get(`${URL_ELEPHANT}/api/brand`);

      return response.data as Brand[];
    } catch (error) {
      console.error("Error fetching laptops:", error);
      throw error;
    }
  }
);

export const fetchByType = createAsyncThunk(
  "promItems/fetchByType",
  async () => {
    try {
      const response = await axios.get(`${URL_ELEPHANT}/api/product`);
      return response.data.rows as Product[];
    } catch (error) {
      console.error("Error fetching laptops:", error);
      throw error;
    }
  }
);

const promItems = createSlice({
  name: "promItems",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAllProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchAllProducts.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchAllTypes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAllTypes.fulfilled,
        (state, action: PayloadAction<Type[]>) => {
          state.status = "succeeded";
          state.type_of_products = action.payload;
        }
      )
      .addCase(fetchAllTypes.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchAllBrands.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAllBrands.fulfilled,
        (state, action: PayloadAction<Brand[]>) => {
          state.status = "succeeded";
          state.brands = action.payload;
        }
      )
      .addCase(fetchAllBrands.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default promItems.reducer;
