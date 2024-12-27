import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import featureReducer from './features/featureSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    features: featureReducer
  },
});

export default store;

