
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Token'ı localStorage'dan alacak ve Authorization header'ına ekleyecek custom baseQuery

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL, 
  
  prepareHeaders: (headers, { getState }) => {
    // 1. LocalStorage'dan veya Auth Slice'tan token'ı al
    const token = localStorage.getItem('userToken'); 

    // 2. Token varsa Authorization header'ına ekle
    if (token) {
      // Örnek: JWT için Bearer şeması kullanılır
      headers.set('Authorization', `Bearer ${token}`);
    }
    // Content-Type'ı JSON olarak ayarlama (Genellikle varsayılan olarak gelir ama ekleyebiliriz)
    headers.set('Content-Type', 'application/json');

    return headers;
  },
});

// Temel API Slice'ı oluşturma
export const baseApi = createApi({
  reducerPath: 'api', // Redux store'daki adı (örn: state.api)
  baseQuery: baseQuery,
  // Tüm endpoint'ler için merkezi tag tanımlaması (Caching için gereklidir)
  tagTypes: ['Products', 'Stores', 'stockinouts','stokcmovements'], 
  endpoints: () => ({}), // Bu boş kalır, endpoint'ler inject edilir.
});