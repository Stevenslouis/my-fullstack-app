import { useEffect, useState } from "react";
import Modal from "react-modal";
import '../css/CreateQuizMenu.css';
import '../css/QuizHistory.css';
import { fetchQuizHistory } from '../services/api';
import { useQuizzes } from '../contexts/QuizContext';

function SpecifcQuizHistory({ isOpen, onClose, quizObject }) {

    const [specificQuizHistoryObject, setSpecifcQuizHistoryObject] = useState(quizObject || []);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {

        setSpecifcQuizHistoryObject(quizObject || [])

    }, [quizObject])

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Quiz History"
            className="quiz-menu-modal"
            overlayClassName="quiz-modal-overlay"
        >
            <div id="myForm">
                <div className="left-label-text title">{specificQuizHistoryObject?.quizName}</div>

                {errorMessage && <div className="error-msg">{errorMessage}</div>}

                <div className="scrollable">
                    <div>Quiz Title: {specificQuizHistoryObject.quizName}</div>
                    {specificQuizHistoryObject.createdAt && (
                        <div>
                            Date: {new Date(specificQuizHistoryObject.createdAt).toISOString().split("T")[0]}
                        </div>
                    )}
                    <div>Score: {specificQuizHistoryObject.score} % </div>
                    <div>Questions:</div>

                    {specificQuizHistoryObject?.quizInfo?.map((quiz, index) => (
                        <div key={index} className="left specifc-quiz-question">
                            <div className=" " > Question {index + 1}: {quiz.title}</div>
                            {quiz.questions.map((question, index) => (
                                <div key={index} className="left" >
                                    <div className={`${question[1]} truncated-text`} >{question[0]}</div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="quit-reset-btns">
                    <button onClick={onClose} className="btn">Go Back</button>
                </div>
            </div>
        </Modal>
    );
}

export default SpecifcQuizHistory;
