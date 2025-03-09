import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// defining the slice
 export const apiSlice = createApi({
    reducerPath:'api',
    baseQuery: fetchBaseQuery({baseUrl:'https://jsonplaceholder.typicode.com'}),
    endpoints: (builder)=>({
        getComments: builder.query({
            query:()=> '/comments'
        })
    })
 })

{/* Export hooks for components */}
 export const { useGetCommentsQuery } = apiSlice;
