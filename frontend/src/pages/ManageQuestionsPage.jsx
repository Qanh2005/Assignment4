import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAdminMessage,
  createQuestion,
  createQuiz,
  deleteQuestion,
  deleteQuiz,
  loadAdminData,
  updateQuestion,
  updateQuiz,
} from "../store/adminSlice.js";

const emptyQuestion = {
  quiz: "",
  text: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
};

export default function ManageQuestionsPage() {
  const dispatch = useDispatch();
  const { quizzes, questions, error, message } = useSelector((state) => state.admin);
  const [quizForm, setQuizForm] = useState({ title: "", description: "" });
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [questionForm, setQuestionForm] = useState(emptyQuestion);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  useEffect(() => {
    dispatch(loadAdminData());
  }, [dispatch]);

  const quizTitle = (quizRef) => {
    if (quizRef && typeof quizRef === "object") return quizRef.title;
    return quizzes.find((q) => q._id === quizRef)?.title || "Quiz";
  };

  const onSaveQuiz = async (e) => {
    e.preventDefault();
    dispatch(clearAdminMessage());
    if (editingQuizId) {
      await dispatch(updateQuiz({ id: editingQuizId, ...quizForm }));
      setEditingQuizId(null);
    } else {
      await dispatch(createQuiz(quizForm));
    }
    setQuizForm({ title: "", description: "" });
  };

  const onSaveQuestion = async (e) => {
    e.preventDefault();
    dispatch(clearAdminMessage());
    const payload = {
      ...questionForm,
      options: questionForm.options.map((o) => o.trim()).filter(Boolean),
      correctAnswer: Number(questionForm.correctAnswer),
    };
    if (editingQuestionId) {
      await dispatch(updateQuestion({ id: editingQuestionId, ...payload }));
      setEditingQuestionId(null);
    } else {
      await dispatch(createQuestion(payload));
    }
    setQuestionForm({ ...emptyQuestion, quiz: quizzes[0]?._id || "" });
  };

  useEffect(() => {
    if (!questionForm.quiz && quizzes[0]?._id) {
      setQuestionForm((prev) => ({ ...prev, quiz: quizzes[0]._id }));
    }
  }, [quizzes, questionForm.quiz]);

  return (
    <div className="container pb-5">
      <h2 className="mb-1">Manage Questions</h2>
      <p className="text-muted mb-4">Create, edit or delete quizzes and questions.</p>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{editingQuizId ? "Edit quiz" : "Create quiz"}</h5>
              <form onSubmit={onSaveQuiz}>
                <div className="mb-2">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={quizForm.description}
                    onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                  />
                </div>
                <button className="btn btn-primary me-2" type="submit">
                  {editingQuizId ? "Update quiz" : "Create quiz"}
                </button>
                {editingQuizId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setEditingQuizId(null);
                      setQuizForm({ title: "", description: "" });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>
          </div>

          <ul className="list-group mt-3 shadow-sm">
            {quizzes.map((quiz) => (
              <li className="list-group-item d-flex justify-content-between align-items-start" key={quiz._id}>
                <div>
                  <strong>{quiz.title}</strong>
                  <div className="small text-muted">{quiz.description}</div>
                </div>
                <div className="btn-group btn-group-sm">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setEditingQuizId(quiz._id);
                      setQuizForm({ title: quiz.title, description: quiz.description || "" });
                    }}
                  >
                    Edit
                  </button>
                  <button className="btn btn-outline-danger" onClick={() => dispatch(deleteQuiz(quiz._id))}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{editingQuestionId ? "Edit question" : "Create question"}</h5>
              <form onSubmit={onSaveQuestion}>
                <div className="mb-2">
                  <label className="form-label">Quiz</label>
                  <select
                    className="form-select"
                    value={questionForm.quiz}
                    onChange={(e) => setQuestionForm({ ...questionForm, quiz: e.target.value })}
                    required
                  >
                    {quizzes.map((quiz) => (
                      <option key={quiz._id} value={quiz._id}>
                        {quiz.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Question text</label>
                  <input
                    className="form-control"
                    value={questionForm.text}
                    onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
                    required
                  />
                </div>
                {questionForm.options.map((option, index) => (
                  <div className="mb-2" key={index}>
                    <label className="form-label">Option {index + 1}</label>
                    <input
                      className="form-control"
                      value={option}
                      onChange={(e) => {
                        const options = [...questionForm.options];
                        options[index] = e.target.value;
                        setQuestionForm({ ...questionForm, options });
                      }}
                      required={index < 2}
                    />
                  </div>
                ))}
                <div className="mb-3">
                  <label className="form-label">Correct option</label>
                  <select
                    className="form-select"
                    value={questionForm.correctAnswer}
                    onChange={(e) =>
                      setQuestionForm({ ...questionForm, correctAnswer: Number(e.target.value) })
                    }
                  >
                    {questionForm.options.map((option, index) => (
                      <option key={index} value={index}>
                        {option || `Option ${index + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="btn btn-primary me-2" type="submit">
                  {editingQuestionId ? "Update question" : "Create question"}
                </button>
                {editingQuestionId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setEditingQuestionId(null);
                      setQuestionForm({ ...emptyQuestion, quiz: quizzes[0]?._id || "" });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>
          </div>

          <ul className="list-group mt-3 shadow-sm">
            {questions.map((q) => (
              <li className="list-group-item" key={q._id}>
                <div className="d-flex justify-content-between gap-3">
                  <div>
                    <div className="small text-muted">{quizTitle(q.quiz)}</div>
                    <strong>{q.text}</strong>
                    <div className="small">
                      {(q.options || []).map((opt, i) => (
                        <span key={i} className={i === q.correctAnswer ? "fw-semibold text-success" : ""}>
                          {i === q.correctAnswer ? "✓ " : ""}
                          {opt}
                          {i < q.options.length - 1 ? " · " : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="btn-group btn-group-sm align-self-start">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => {
                        setEditingQuestionId(q._id);
                        setQuestionForm({
                          quiz: typeof q.quiz === "object" ? q.quiz._id : q.quiz,
                          text: q.text,
                          options: [...q.options, "", "", "", ""].slice(0, 4),
                          correctAnswer: q.correctAnswer,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button className="btn btn-outline-danger" onClick={() => dispatch(deleteQuestion(q._id))}>
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
