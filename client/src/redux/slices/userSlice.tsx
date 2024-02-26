// userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { RootState } from "../store";

interface UserState {
  isAuth: boolean;
  user: Record<string, any>;
}

interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

interface LoginParams {
  email: string;
  password: string;
}

const initialState: UserState = {
  isAuth: false,
  user: {},
};

export const fetchRegister = createAsyncThunk(
  "user/fetchRegister",
  async (params: RegisterParams, { rejectWithValue }) => {
    const { name, email, password } = params;
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/registration",
        {
          name: name,
          email: email,
          password: password,
        }
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchLogin = createAsyncThunk(
  "user/fetchLogin",
  async (params: LoginParams, { rejectWithValue }) => {
    const { email, password } = params;
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        {
          email: email,
          password: password,
        }
      );

      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
    setUser: (state, action: PayloadAction<Record<string, any>>) => {
      state.user = action.payload;
    },
    setLogout: (state) => {
      state.user = initialState.user;
      state.isAuth = initialState.isAuth;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLogin.fulfilled, (state, action) => {
      console.log("Login succeeded:", action.payload);
      state.isAuth = true;
      state.user = action.payload;
    });
    builder.addCase(fetchLogin.rejected, (state, action) => {
      console.error("Login failed:", action.error.message);
    });
    builder.addCase(fetchRegister.fulfilled, (state, action) => {
      console.log("Registration succeeded:", action.payload);
      state.isAuth = true;
      state.user = action.payload;
    });
    builder.addCase(fetchRegister.rejected, (state, action) => {
      state.isAuth = false; // Set isAuth to false on registration failure

      console.error("Registration failed:", action.error.message);
    });
  },
});

export const { setIsAuth, setUser, setLogout } = userSlice.actions;

export const selectIsAuth = (state: RootState) => state.user.isAuth;
export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
