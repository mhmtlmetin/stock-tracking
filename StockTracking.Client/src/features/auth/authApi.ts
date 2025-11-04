import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from './authSlice';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/Auth/login',
        method: 'POST',
        body: credentials, // { username, password }
      }),
      // Başarılı giriş sonrası işlemi
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Token ve kullanıcı bilgisini Redux state'e kaydediyoruz
          dispatch(setCredentials({ user: data.user, token: data.token }));
          // İsteğe bağlı: Token'ı localStorage'a kaydetme (Yenileme için)
          localStorage.setItem('userToken', data.token);
        } catch (error) {
          console.error('Login başarısız oldu', error);
        }
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;