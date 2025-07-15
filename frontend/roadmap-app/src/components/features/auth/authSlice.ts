// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// const initialState = {
//   token: localStorage.getItem('token') || null,
//   user: JSON.parse(localStorage.getItem('user') || 'null'),
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setToken: (state, action: PayloadAction<string>) => {
//       state.token = action.payload;
//       localStorage.setItem('token', action.payload);
//     },
//     setUser: (state, action: PayloadAction<any>) => {
//       state.user = action.payload;
//       localStorage.setItem('user', JSON.stringify(action.payload));
//     },
//     logout: (state) => {
//       state.token = null;
//       state.user = null;
//       localStorage.clear();
//     },
//   },
// });

// export const { setToken, setUser, logout } = authSlice.actions;
// export default authSlice.reducer;



import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.clear();
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;






