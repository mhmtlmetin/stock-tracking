import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authApi';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    // RTK Query API Reducer'ı
    [authApi.reducerPath]: authApi.reducer,
    // Ek Redux Slice Reducer'ları (örn. Auth State)
    auth: authReducer,
  },
  // RTK Query middleware'ini ekleme
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});