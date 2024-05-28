import { createSlice } from "@reduxjs/toolkit";
import { getCurrentAccountPostThunk } from "../../apiThunk/postThunk";

export const postAccountSlice = createSlice({
    name: "postAccount",
    initialState: {
        entities: [],
        draft: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getCurrentAccountPostThunk.pending, (state) => {
                state.loading = true;
                state.loading = "loading";
                state.error = null;
            })
            .addCase(getCurrentAccountPostThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = "succeeded";
                state.entities = action.payload;
            })
            .addCase(getCurrentAccountPostThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default postAccountSlice.reducer;
