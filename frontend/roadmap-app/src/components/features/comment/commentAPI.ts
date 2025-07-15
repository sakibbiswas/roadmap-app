// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const commentAPI = createApi({
//   reducerPath: 'commentAPI',
//   baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/comments' }),
//   tagTypes: ['Comment'],
//   endpoints: (builder) => ({
//     getComments: builder.query({
//       query: (roadmapId) => `/?roadmapId=${roadmapId}`,
//       providesTags: ['Comment'],
//     }),
//     createComment: builder.mutation({
//       query: (data) => ({
//         url: '/',
//         method: 'POST',
//         body: data,
//       }),
//       invalidatesTags: ['Comment'],
//     }),
//   }),
// });

// export const {
//   useGetCommentsQuery,
//   useCreateCommentMutation,
// } = commentAPI;




// features/comment/commentAPI.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define Comment interface if you haven't already (simplified example)
interface Comment {
  _id: string;
  roadmapId: string;
  content: string;
  userId: string;
  parent?: string;
  replies?: Comment[];
  // add other fields you use
}

// Define input type for creating a comment
interface CreateCommentPayload {
  roadmapId: string;
  content: string;
  parent?: string;  // optional parent comment id for replies
}

export const commentAPI = createApi({
  reducerPath: 'commentAPI',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/comments' }),
  tagTypes: ['Comment'],
  endpoints: (builder) => ({
    getCommentsByRoadmap: builder.query<Comment[], string>({
      query: (roadmapId) => `?roadmapId=${roadmapId}`,
      providesTags: ['Comment'],
    }),
    createComment: builder.mutation<Comment, CreateCommentPayload>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Comment'],
    }),
    updateComment: builder.mutation<Comment, { id: string; content: string }>({
      query: ({ id, content }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: { content },
      }),
      invalidatesTags: ['Comment'],
    }),
    deleteComment: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comment'],
    }),
  }),
});

export const {
  useGetCommentsByRoadmapQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentAPI;
