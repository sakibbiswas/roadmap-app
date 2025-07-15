import { createSlice } from '@reduxjs/toolkit';

const commentSlice = createSlice({
  name: 'comment',
  initialState: {
    replyDepth: 3,
  },
  reducers: {
    setReplyDepth: (state, action) => {
      state.replyDepth = action.payload;
    },
  },
});

export const { setReplyDepth } = commentSlice.actions;
export default commentSlice.reducer;