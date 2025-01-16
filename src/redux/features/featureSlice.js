import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { checkUserFeature } from "../../components/apiService";

export const fetchAllowedFeatures = createAsyncThunk( 'features/fetchAllowedFeatures',
  async(userId, {rejectedWithValues}) => {
    try{
      const response = await checkUserFeature(userId);
      localStorage.setItem("current_user_feature",response);
      return response;
    }catch(error){
      console.log(error);
      return rejectedWithValues(error.response?.data || error.message);
    }
  }
  );

  const featureSlice = createSlice({
    name: 'features',
    initialState: {
      featureAllowed: [],
      loading: false,
      error: null
    },
    reducers: {
      clearFeatures: (state) => {
        state.featureAllowed = [];
      },
    },
    extraReducers: (builder) => {
      builder
       .addCase(fetchAllowedFeatures.pending, (state) => {
          state.loading = true;
          state.error = null;
       })
       .addCase(fetchAllowedFeatures.fulfilled, (state, action) => {
         state.loading = false;
         state.featureAllowed = action.payload;
       })
       .addCase(fetchAllowedFeatures.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload;
       });
    },
  });

  export const { clearFeatures } = featureSlice.actions;
  export default featureSlice.reducer;