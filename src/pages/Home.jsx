import { useEffect, useState } from 'react';
import { useQuizzes } from '../contexts/QuizContext';
import CreateQuizMenu from '../components/CreateQuizMenu';
import DeleteQuiz from '../components/DeleteQuiz';
import EditQuiz from '../components/EditQuiz';
import '../css/Home.css';
import QuizHistory from '../components/QuizHistory';

function Home() {
  const {
    quizzes,
    loading,
    error,
    setQuizzes,
    setError,
    refreshQuizzes,
    navigate
  } = useQuizzes();


  const [currentQuizId, setCurrentQuizId] = useState(null)
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [deleteQuizModalOpen, setDeleteQuizModalOpen] = useState(false);
  const [editQuizModalOpen, setEditQuizModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refreshQuizzes();
      } catch (err) {
        setError(err.message)
      }
    };
    checkAuth();
  }, []);

  const hasQuizzes = quizzes.length > 0;

  const startQuiz = (id) => {
    navigate(`/quiz/${id}`);
  };


  const handleQuizDeleted = async () => {
    try {
      await refreshQuizzes();
      setDeleteQuizModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleQuizUpdated = async () => {
    try {
      await refreshQuizzes();
      setEditQuizModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };


  const getHistory = (id) => {
    setCurrentQuizId(id)
    setHistoryModalOpen(true)
  }
  const editQuiz = (id) => {
    setCurrentQuizId(id)
    setEditQuizModalOpen(true)
  }

  const deleteQuiz = (id) => {
    setCurrentQuizId(id)
    setDeleteQuizModalOpen(true)
  }

  if (loading) return <div>Loading quizzes...</div>;
  if (error) { navigate('/login') };

  return (
    <div className={`background-home ${hasQuizzes && "top"}`}>
      {hasQuizzes ? (
        <div className='quizzes-list'>
          {quizzes.map((quiz, index) => (
            <div key={index} className='quiz-row'>
              <div className='quiz-info'>
                <div className='quiz-title'>{quiz.title}</div>
              </div>
              <div className='quiz-options'>
                <button
                  className='option-btn edit edit-btn'
                  onClick={() => editQuiz(quiz._id)}
                ></button>
                <button
                  className='option-btn run play-btn'
                  onClick={() => startQuiz(quiz._id)} // Use _id instead of title
                > </button>
                <button
                  onClick={() => deleteQuiz(quiz._id)}
                  className='option-btn delete delete-btn'
                ></button>
                <button onClick={() => getHistory(quiz._id)}
                  className='history-btn view'></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        "You Have No Quizzes, Click the + to create a new one"
      )}

      <button
        className="floating-plus-btn"
        onClick={() => setCreateMenuOpen(true)}
      >
      </button>

      <EditQuiz
        isOpen={editQuizModalOpen}
        onClose={() => setEditQuizModalOpen(false)}
        onDeleteSuccess={handleQuizUpdated} // Pass callback  
        quizId={currentQuizId}
      />

      <DeleteQuiz
        isOpen={deleteQuizModalOpen}
        onClose={() => setDeleteQuizModalOpen(false)}
        onDeleteSuccess={handleQuizDeleted} // Pass callback  
        quizId={currentQuizId}
      />

      <CreateQuizMenu
        isOpen={createMenuOpen}
        onClose={() => setCreateMenuOpen(false)}
      />

      <QuizHistory
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        quizId={currentQuizId}

      />
    </div>
  );
}

export default Home;