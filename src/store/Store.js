import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import aiReducer from "./slices/AISlice.js";

const AIStore = configureStore({
    reducer: { 
        auth: authReducer,
        ai: aiReducer
    }
});

export default AIStore;