import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchQuizzes } from "../store/quizSlice.js";

export default function HomePage() {
  const dispatch = useDispatch();
  const { quizzes, status } = useSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  return (
    <div className="container pb-5">
      {status === "loading" && <p className="text-muted">Loading quizzes...</p>}
      {quizzes.length === 0 && status !== "loading" && (
        <p className="text-muted">No quizzes available.</p>
      )}
      {quizzes.map((quiz) => (
        <div key={quiz._id} className="mb-3">
          <Link to="/dashboard/quiz" className="home-quiz-link">
            <span className="home-quiz-title">{quiz.title}</span>
            {quiz.description && (
              <span className="home-quiz-desc">{quiz.description}</span>
            )}
          </Link>
        </div>
      ))}
      {quizzes.length > 0 && (
        <div className="mt-2">
          <p className="text-muted fw-medium">Click and do Quiz</p>
        </div>
      )}
    </div>
  );
}
