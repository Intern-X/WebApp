import { createSlice } from "@reduxjs/toolkit";

export const statusSlice = createSlice({
    name: "status",
    initialState: {
        loading: true,
        refresh: false,
    },
    // add validator
    reducers: {
        toggleLoad: (state, action) => {
            state.loading = action.payload;
        },
        toggleRefresh: (state) => {
            state.refresh = !state.refresh;
        }
    },
});

export const { toggleLoad, toggleRefresh } = statusSlice.actions;

export default statusSlice.reducer;