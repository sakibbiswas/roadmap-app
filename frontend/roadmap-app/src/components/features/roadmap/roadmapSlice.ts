import { createSlice } from '@reduxjs/toolkit';

const roadmapSlice = createSlice({
  name: 'roadmap',
  initialState: {
    filter: 'All',
    sort: 'Newest',
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
  },
});

export const { setFilter, setSort } = roadmapSlice.actions;
export default roadmapSlice.reducer;