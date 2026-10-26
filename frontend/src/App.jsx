import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import AdminLayout from "./pages/AdminLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";
import AdminHomePage from "./pages/AdminHomePage.jsx";
import ManageQuestionsPage from "./pages/ManageQuestionsPage.jsx";
import ManageArticlesPage from "./pages/ManageArticlesPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function RootRedirect() {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={user ? <RootRedirect /> : <LoginPage />} />
      <Route path="/register" element={user ? <RootRedirect /> : <RegisterPage />} />

      {/* Regular user dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="article" element={<ArticlePage />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHomePage />} />
        <Route path="manage-questions" element={<ManageQuestionsPage />} />
        <Route path="manage-articles" element={<ManageArticlesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
