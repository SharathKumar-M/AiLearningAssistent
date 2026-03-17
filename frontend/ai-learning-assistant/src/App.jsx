import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import DocumentListPage from './pages/documents/DocumentListPage';
import DocumentDetailPage from './pages/documents/DocumentDetailPage';
import FlashcardsListPage from './pages/flashcards/FlashcardsListPage';
import FlashcardPage from './pages/flashcards/FlashcardPage';
import QuizTakePage from './pages/quizzes/QuizTakePage';
import QuizresultPage from './pages/quizzes/QuizresultPage';
import ProfilePage from './pages/profile/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './component/auth/ProtectedRoute';


const App = () => {
  const isAuthenticated = false;
  const loading = false;

  if(loading) {
  return (
    <div className='flext items-center justify-center h-screen'>
      <p>Loading....</p>
    </div>
    
  );
}

return (
  <Router>
    <Routes>
      <Route
      path="/"
      elemengt={isAuthenticated ? <Navigate to ="/dashboard" replace /> : <Navigate to="/login" replace />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/documents" element={<DocumentListPage />} />
        <Route path="/documents/:id" element={<DocumentDetailPage />} />
        <Route path="/flashcards" element={<FlashcardsListPage />} />
        <Route path="/documents/:id/flashcards" element={<FlashcardPage />} />
        <Route path="/quizzes/:quizid" element={<QuizTakePage />} />
        <Route path="/quizzes/:quizid/results" element={<QuizresultPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>



      <Route path="*" element={<NotFoundPage />} />
      f
    </Routes>
  </Router>
)
}

export default App