import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


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



      <Route path="*" element={<NotFoundPage />} />
      f
    </Routes>
  </Router>
)
}

export default App