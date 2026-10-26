import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axios.js";

const initialState = {
  quizzes: [],
  currentQuiz: null,
  questions: [],
  currentIndex: 0,
  selectedOption: null,
  answers: [],
  score: null,
  total: null,
  status: "idle",
  error: null,
};

export const fetchQuizzes = createAsyncThunk("quiz/fetchQuizzes", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/quizzes");
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load quizzes");
  }
});

export const fetchQuiz = createAsyncThunk("quiz/fetchQuiz", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/quizzes/${id}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load quiz");
  }
});

export const submitQuiz = createAsyncThunk(
  "quiz/submit",
  async ({ quizId, answers }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/quizzes/${quizId}/submit`, { answers });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to submit quiz");
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    selectOption: (state, action) => {
      state.selectedOption = action.payload;
    },
    saveAnswerAndNext: (state) => {
      const question = state.questions[state.currentIndex];
      if (!question || state.selectedOption === null) return;
      state.answers.push({
        questionId: question._id,
        selectedIndex: state.selectedOption,
      });
      state.selectedOption = null;
      state.currentIndex += 1;
    },
    restartQuiz: (state) => {
      state.currentIndex = 0;
      state.selectedOption = null;
      state.answers = [];
      state.score = null;
      state.total = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchQuiz.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentQuiz = action.payload;
        state.questions = action.payload.questions || [];
        state.currentIndex = 0;
        state.selectedOption = null;
        state.answers = [];
        state.score = null;
        state.total = null;
      })
      .addCase(fetchQuiz.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.score = action.payload.score;
        state.total = action.payload.total;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { selectOption, saveAnswerAndNext, restartQuiz } = quizSlice.actions;
export default quizSlice.reducer;
