import { createContext, useContext, useState, useEffect } from 'react';
import { fetchQuizzes } from '../services/api';
import { useNavigate } from 'react-router-dom';

const QuizContext = createContext();

export function QuizProvider({ children }) {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshQuizzes = async () => {
    setLoading(true);
    try {
      const response = await fetchQuizzes();

      if (!response.success) {
        navigate("/login")
        return
      }
      setQuizzes(response.data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const loggedin = async () => {
    try {
      const response = await isLoggedIn()
      if (response.success) {
        return true
      } else {
        return false
      }
    } catch (err) {

    }
  }


const value = {
  quizzes,
  refreshQuizzes,
  setQuizzes,
  navigate,
  loggedin
};

return (
  <QuizContext.Provider value={value}>
    {children}
  </QuizContext.Provider>
);
}

export function useQuizzes() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizzes must be used within a QuizProvider');
  }
  return context;
}