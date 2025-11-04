import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { baseApi } from './api/baseApi';

export const store = configureStore({
  reducer: {
    // RTK Query API Reducer'ı
    [baseApi.reducerPath]: baseApi.reducer,
    // Ek Redux Slice Reducer'ları (örn. Auth State)
    auth: authReducer,
  },
  // RTK Query middleware'ini ekleme
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});