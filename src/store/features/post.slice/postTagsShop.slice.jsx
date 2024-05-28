import { createSlice } from "@reduxjs/toolkit";
import { getPostTagShopThunk } from "../../apiThunk/postThunk";

export const postTagsShopSlice = createSlice({
    name: "postTagsShop",
    initialState: {
        entities: [],
        draft: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getPostTagShopThunk.pending, (state) => {
                state.loading = true;
                state.loading = "loading";
                state.error = null;
            })
            .addCase(getPostTagShopThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = "succeeded";
                state.entities = action.payload;
            })
            .addCase(getPostTagShopThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default postTagsShopSlice.reducer;
