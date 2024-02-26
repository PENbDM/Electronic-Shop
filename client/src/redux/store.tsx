import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";
import promItemsReducer from "./slices/promItems"; // Add this import

const persistConfig = {
  key: "root",
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    cart: cartReducer, // Fix the key here to match the reducer name
    user: persistedUserReducer,
    promItems: promItemsReducer, // Add this line
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
