import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API URL
const API_URL = "https://jsonplaceholder.typicode.com/users";

// Async thunk to fetch contacts
export const fetchContacts = createAsyncThunk("contacts/fetchContacts", async () => {
    const response = await axios.get(API_URL);
    return response.data; // Assuming API response is an array of users
});

// Redux slice
const contactsSlice = createSlice({
    name: "contacts",
    initialState: {
        contacts: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchContacts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.loading = false;
                state.contacts = action.payload;
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.loading = false;
                state.error = "Failed to fetch contacts.";
            });
    },
});

// Export the reducer
export default contactsSlice.reducer;
