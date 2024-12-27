import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllowedFeatures = createAsyncThunk( 'features/fetchAllowedFeatures',
  async(userId, {rejectedWithValues}) => {
    try{
      const token = localStorage.getItem('token');
      const response = await axios.post("http://localhost:3000/users/checkinguserfeature", 
        {userid: userId},
        {
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.allowed_features;
    }catch(error){
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