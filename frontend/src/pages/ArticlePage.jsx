export default function ArticlePage() {
  return (
    <div className="container pb-5">
      <div className="article-card">
        <h2 className="mb-3">Article</h2>
        <p>
          Quizzes are a simple way to check what you remember. This application lets regular users
          take quizzes question by question, then shows a final score. Admins can create, update,
          and delete quizzes and questions from the Manage page.
        </p>
        <p className="mb-0 text-muted">
          Tip: answers are checked on the server so the correct option is not exposed to regular users.
        </p>
      </div>
    </div>
  );
}
