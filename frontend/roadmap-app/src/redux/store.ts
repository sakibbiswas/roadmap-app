
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux'; // ✅ type-only import

import roadmapReducer from '../components/features/roadmap/roadmapSlice';
import commentReducer from '../components/features/comment/commentSlice';
import authReducer from '../components/features/auth/authSlice';

import { authAPI } from '../components/features/auth/authAPI';
import { roadmapAPI } from '../components/features/roadmap/roadmapAPI';
import { commentAPI } from '../components/features/comment/commentAPI';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    roadmap: roadmapReducer,
    comment: commentReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [roadmapAPI.reducerPath]: roadmapAPI.reducer,
    [commentAPI.reducerPath]: commentAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authAPI.middleware)
      .concat(roadmapAPI.middleware)
      .concat(commentAPI.middleware),
});

// ✅ Global types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ✅ Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;




