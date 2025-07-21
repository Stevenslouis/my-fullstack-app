import { useEffect, useState } from "react";
import Modal from "react-modal";
import '../css/DeleteQuiz.css'
//import '../css/DeleteQuiz.css'
import { deleteQuiz } from '../services/api';
import { useQuizzes } from '../contexts/QuizContext';


function DeleteQuiz({ isOpen, onClose, quizId }) {


    const [errorMessage, setErrorMessage] = useState("")
    const {
        refreshQuizzes,
    } = useQuizzes();

    const delete_quiz = async () => {
        try {
            const response = await deleteQuiz(quizId)

            if (response.success) {
                await refreshQuizzes()
                onClose()
            } else {
                setErrorMessage("Could not delete quiz. Try again")
            }
        } catch (err) {
            setErrorMessage("Could not delete quiz. Cannot connect to server")
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Delete Quiz Modal"
            className="delete-quiz-modal"
            overlayClassName="quiz-modal-overlay"
        >
            <div className="content">
                <div>Are You Sure You Want To Delete This Quiz?</div>
                <div className="error-msg">{errorMessage}</div>

                <div className="deletequiz-btns">
                    <button className="btn" onClick={onClose} >Cancel</button>
                    <button className="btn" onClick={delete_quiz}>Delete</button>
                </div>
            </div>
        </Modal >
    )
}

export default DeleteQuiz
