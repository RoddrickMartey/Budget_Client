import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import userReducer from "./slices/userSlice/userSlice";

// Persist config
const persistConfig = {
  key: "user",
  storage,
  whitelist: ["user"], // Persist only the user slice
};

// Persisted reducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Create store
export const store = configureStore({
  reducer: {
    user: persistedUserReducer, // Persisted user reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevent Redux Persist warnings
    }),
});

// Persistor
export const persistor = persistStore(store);

export default store;
