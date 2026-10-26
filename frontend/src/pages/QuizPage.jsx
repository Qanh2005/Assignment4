import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuiz,
  fetchQuizzes,
  restartQuiz,
  saveAnswerAndNext,
  selectOption,
  submitQuiz,
} from "../store/quizSlice.js";

export default function QuizPage() {
  const dispatch = useDispatch();
  const { quizzes, currentQuiz, questions, currentIndex, selectedOption, answers, score, total, status, error } =
    useSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  useEffect(() => {
    if (!currentQuiz && quizzes.length > 0) {
      dispatch(fetchQuiz(quizzes[0]._id));
    }
  }, [currentQuiz, quizzes, dispatch]);

  const question = questions[currentIndex];
  const finished = score !== null;

  const onSubmitAnswer = (e) => {
    e.preventDefault();
    if (selectedOption === null || !question) return;
    const isLast = currentIndex === questions.length - 1;
    const nextAnswers = [
      ...answers,
      { questionId: question._id, selectedIndex: selectedOption },
    ];
    dispatch(saveAnswerAndNext());
    if (isLast && currentQuiz) {
      dispatch(submitQuiz({ quizId: currentQuiz._id, answers: nextAnswers }));
    }
  };

  const onRestart = () => {
    dispatch(restartQuiz());
  };

  if (status === "loading" && !question) {
    return <div className="quiz-wrap">Loading quiz...</div>;
  }

  if (error) {
    return <div className="quiz-wrap text-danger">{error}</div>;
  }

  if (finished) {
    return (
      <div className="quiz-wrap">
        <h2>Quiz Completed</h2>
        <p className="text-muted">Your score: {score ?? 0}</p>
        <button className="btn btn-primary px-4" onClick={onRestart}>
          Restart Quiz
        </button>
      </div>
    );
  }

  if (!question) {
    return <div className="quiz-wrap">No questions available.</div>;
  }

  return (
    <div className="quiz-wrap">
      <h2>Quiz</h2>
      <div className="quiz-question">{question.text}</div>
      <form onSubmit={onSubmitAnswer}>
        <div className="quiz-options mb-4">
          {question.options.map((option, index) => (
            <div className="form-check" key={option}>
              <input
                className="form-check-input"
                type="radio"
                name="answer"
                id={`option-${index}`}
                checked={selectedOption === index}
                onChange={() => dispatch(selectOption(index))}
              />
              <label className="form-check-label" htmlFor={`option-${index}`}>
                {option}
              </label>
            </div>
          ))}
        </div>
        <button className="btn btn-primary px-4" type="submit" disabled={selectedOption === null}>
          Submit Answer
        </button>
      </form>
    </div>
  );
}
