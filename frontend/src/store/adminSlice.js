import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axios.js";

const initialState = {
  quizzes: [],
  questions: [],
  status: "idle",
  error: null,
  message: null,
};

export const loadAdminData = createAsyncThunk("admin/load", async (_, { rejectWithValue }) => {
  try {
    const [quizzes, questions] = await Promise.all([
      api.get("/quizzes"),
      api.get("/questions"),
    ]);
    return { quizzes: quizzes.data, questions: questions.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load admin data");
  }
});

export const createQuiz = createAsyncThunk("admin/createQuiz", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/quizzes", payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create quiz");
  }
});

export const updateQuiz = createAsyncThunk("admin/updateQuiz", async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/quizzes/${id}`, payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update quiz");
  }
});

export const deleteQuiz = createAsyncThunk("admin/deleteQuiz", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/quizzes/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete quiz");
  }
});

export const createQuestion = createAsyncThunk("admin/createQuestion", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/questions", payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create question");
  }
});

export const updateQuestion = createAsyncThunk("admin/updateQuestion", async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/questions/${id}`, payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update question");
  }
});

export const deleteQuestion = createAsyncThunk("admin/deleteQuestion", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/questions/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete question");
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminMessage: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAdminData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadAdminData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.quizzes = action.payload.quizzes;
        state.questions = action.payload.questions;
      })
      .addCase(loadAdminData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.quizzes.push(action.payload);
        state.message = "Quiz created";
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.map((q) => (q._id === action.payload._id ? action.payload : q));
        state.message = "Quiz updated";
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter((q) => q._id !== action.payload);
        state.questions = state.questions.filter((q) => {
          const quizId = typeof q.quiz === "object" ? q.quiz?._id : q.quiz;
          return quizId !== action.payload;
        });
        state.message = "Quiz deleted";
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.questions.push(action.payload);
        state.message = "Question created";
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.map((q) =>
          q._id === action.payload._id ? action.payload : q
        );
        state.message = "Question updated";
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter((q) => q._id !== action.payload);
        state.message = "Question deleted";
      });
  },
});

export const { clearAdminMessage } = adminSlice.actions;
export default adminSlice.reducer;
