import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import quizReducer from "./quizSlice.js";
import adminReducer from "./adminSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    admin: adminReducer,
  },
});
