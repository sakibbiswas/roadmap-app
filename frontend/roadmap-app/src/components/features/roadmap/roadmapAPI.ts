// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const roadmapAPI = createApi({
//   reducerPath: 'roadmapAPI',
//   baseQuery: fetchBaseQuery({
//     baseUrl: 'http://localhost:5000/api/roadmaps',
//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         headers.set('Authorization', `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   tagTypes: ['Roadmap'],
//   endpoints: (builder) => ({
//     getRoadmaps: builder.query({
//       query: () => '/',
//       providesTags: ['Roadmap'],
//     }),
//     createRoadmap: builder.mutation({
//       query: (data) => ({
//         url: '/',
//         method: 'POST',
//         body: data,
//       }),
//       invalidatesTags: ['Roadmap'],
//     }),
//     upvoteRoadmap: builder.mutation({
//       query: (id) => ({
//         url: `/${id}/upvote`,
//         method: 'PATCH',
//       }),
//       invalidatesTags: ['Roadmap'],
//     }),
//   }),
// });

// export const {
//   useGetRoadmapsQuery,
//   useCreateRoadmapMutation,
//   useUpvoteRoadmapMutation,
// } = roadmapAPI;




import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const roadmapAPI = createApi({
  reducerPath: 'roadmapAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/roadmaps',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Roadmap'],
  endpoints: (builder) => ({
    getRoadmaps: builder.query({
      query: () => '/',
      providesTags: ['Roadmap'],
    }),
    createRoadmap: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Roadmap'],
    }),
    upvoteRoadmap: builder.mutation({
      query: (id) => ({
        url: `/${id}/upvote`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Roadmap'],
    }),
  }),
});

export const {
  useGetRoadmapsQuery,
  useCreateRoadmapMutation,
  useUpvoteRoadmapMutation,
} = roadmapAPI;
