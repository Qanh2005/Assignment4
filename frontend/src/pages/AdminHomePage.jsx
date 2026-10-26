import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAdminData } from "../store/adminSlice.js";

export default function AdminHomePage() {
  const dispatch = useDispatch();
  const { quizzes, questions, status } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(loadAdminData());
  }, [dispatch]);

  return (
    <div className="container pb-5">
      <div className="row g-4 mt-1">
        <div className="col-md-4">
          <div className="card text-center h-100 shadow-sm">
            <div className="card-body py-4">
              <div className="display-4 fw-bold text-primary">{quizzes.length}</div>
              <div className="text-muted mt-1">Total Quizzes</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center h-100 shadow-sm">
            <div className="card-body py-4">
              <div className="display-4 fw-bold text-success">{questions.length}</div>
              <div className="text-muted mt-1">Total Questions</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center h-100 shadow-sm">
            <div className="card-body py-4">
              <div className="display-4 fw-bold text-warning">2</div>
              <div className="text-muted mt-1">Registered Users</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-muted">
          You are signed in as an <strong>admin</strong>. Use the navigation above to manage questions and articles.
        </p>
      </div>
    </div>
  );
}
