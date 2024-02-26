import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  // Add other necessary fields
}

interface CartState {
  cartItems: CartItem[];
  status: "loading" | "succeeded" | "failed";
}

const initialState: CartState = {
  cartItems: [],
  status: "loading",
};

export const fetchAllItemsCart = createAsyncThunk<CartItem[]>(
  "cartItems/fetchAllItemsCart",
  async (_, { getState }) => {
    try {
      const { user } = getState() as RootState;
      const token = user.user.token;
      const { data } = await axios.get("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      throw error;
    }
  }
);

interface AddToCartPayload {
  productId: number;
}

export const addToCart = createAsyncThunk<
  CartItem,
  AddToCartPayload,
  { rejectValue: any }
>("cart/addToCart", async ({ productId }, { getState, rejectWithValue }) => {
  try {
    const { user } = getState() as RootState;
    const token = user.user.token;

    const { data } = await axios.post(
      "http://localhost:5000/api/cart",
      { productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data.cartItem as CartItem;
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return rejectWithValue(error); // Handle the error by rejecting with the error value
  }
});

export const deleteCartItem = createAsyncThunk<
  CartItem[],
  number,
  { getState: () => RootState; rejectValue: any }
>("cart/deleteCartItem", async (productId, { getState, rejectWithValue }) => {
  try {
    const { user } = getState() as RootState;
    const token = user.user.token;

    const { data } = await axios.delete("http://localhost:5000/api/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { productId }, // Include productId in the request body
    });

    return data;
  } catch (error) {
    console.error("Error deleting product from cart:", error);
    return rejectWithValue(error);
  }
});
export const updateCartItemQuantity = createAsyncThunk<
  void,
  { id: number; quantityAdjustment: number },
  { rejectValue: any }
>(
  "cart/updateCartItemQuantity",
  async ({ id, quantityAdjustment }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState() as RootState;
      const token = user.user.token;

      await axios.put(
        "http://localhost:5000/api/cart",
        {
          id,
          quantityAdjustment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Returning void as there's no specific payload to return
    } catch (error) {
      console.error("Error updating quantity:", error);
      return rejectWithValue(error);
    }
  }
);
export const clearCart = createAsyncThunk<void, void, { rejectValue: any }>(
  "cart/clearCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState() as RootState;
      const token = user.user.token;

      await axios.delete("http://localhost:5000/api/cart/clear", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      return rejectWithValue(error);
    }
  }
);

const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllItemsCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAllItemsCart.fulfilled,
        (state, action: PayloadAction<CartItem[]>) => {
          state.status = "succeeded";
          state.cartItems = action.payload;
        }
      )
      .addCase(fetchAllItemsCart.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        addToCart.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          state.status = "succeeded";
          state.cartItems.push(action.payload);
        }
      )
      .addCase(addToCart.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteCartItem.fulfilled,
        (state, action: PayloadAction<CartItem[]>) => {
          state.status = "succeeded";
          state.cartItems = action.payload;
        }
      )
      .addCase(deleteCartItem.rejected, (state) => {
        state.status = "failed";
      });
    builder
      .addCase(clearCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.status = "succeeded";
        state.cartItems = [];
      })
      .addCase(clearCart.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default cart.reducer;
