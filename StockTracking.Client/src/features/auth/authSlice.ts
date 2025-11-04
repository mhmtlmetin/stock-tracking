import { createSlice } from '@reduxjs/toolkit';

// Başlangıçta localStorage'dan token'ı kontrol edebiliriz
const token = localStorage.getItem('userToken');

const initialState = {
  user: null, 
  token: token || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('userToken');
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

// Selector: Kullanıcı giriş yapmış mı kontrolü
export const selectIsAuthenticated = (state:any) => !!state.auth.token;