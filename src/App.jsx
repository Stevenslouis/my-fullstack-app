import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QuizProvider } from './contexts/QuizContext';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Login from './pages/Login';
import Register from './pages/Register';
import NavBar from './components/NavBar';
import ForgotPassword from './pages/Forgot-Password'
import ResetPassword from './pages/Reset-Password'
import { Navigate } from 'react-router-dom';

import './css/App.css'

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);

  return (
    <QuizProvider>
      <div className='app-container'>
        {!isAuthPage && <NavBar />}
        <div className="page-content">

          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/home" element={<Home />} />
            <Route path="/quiz/:quizId" element={<Quiz />} />
            <Route path="*" element={<p>Page not found</p>} />
          </Routes>
        </div>
      </div>
    </QuizProvider>
  );
}

export default AppWrapper;