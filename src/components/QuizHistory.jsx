import { useEffect, useState } from "react";
import Modal from "react-modal";
import '../css/CreateQuizMenu.css';
import '../css/QuizHistory.css';
import { fetchQuizHistory } from '../services/api';
import SpecifcQuizHistory from "./SpecifcQuizHistory";

function QuizHistory({ isOpen, onClose, quizId }) {
    const [specifcHistoryOpen, setSpecificHistoryOpen] = useState(false)
    const [quizHistoryObject, setQuizHistoryObject] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState(null)

    const openModal = (quizObject) => [
        setSelectedHistory(quizObject),
        setSpecificHistoryOpen(true)
    ]

    useEffect(() => {
        const fetchHistory = async () => {
            if (!quizId) return;

            setLoading(true);
            try {
                const response = await fetchQuizHistory(quizId);
                if (response.success) {
                    setErrorMessage('')

                    setQuizHistoryObject(response.data || []);
                } else {
                    setErrorMessage("Failed to load quiz history.");
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setErrorMessage("Error loading quiz history.");
            } finally {

                setLoading(false);
            }
        };

        fetchHistory();

    }, [quizId]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Quiz History"
            className="quiz-menu-modal"
            overlayClassName="quiz-modal-overlay"
        >
            <div id="myForm">
                <div className="left-label-text title">Quiz History</div>

                {errorMessage && <div className="error-msg">{errorMessage}</div>}

                <div className="scrollable">
                    {loading ? (
                        <div>Loading...</div>
                    ) : quizHistoryObject.length === 0 ? (
                        <div>No history found for this quiz.</div>
                    ) : (
                        quizHistoryObject.map((historyData, index) => (
                            <button key={index}

                                onClick={() => openModal(historyData)}
                                className=" history-entry-btn history-entry history-quiz-display btn">
                                <div>Quiz Title: {historyData.quizName}</div>
                                <div>Date: {new Date(historyData.createdAt).toISOString().split("T")[0]} </div>
                                <div>Score: {historyData.score} % </div>

                            </button>
                        ))
                    )}
                </div>

                <div className="quit-reset-btns">
                    <button onClick={onClose} className="btn">Close</button>
                </div>
            </div>

            <SpecifcQuizHistory
                isOpen={specifcHistoryOpen}
                onClose={() => setSpecificHistoryOpen(false)}
                quizObject={selectedHistory}
            />
        </Modal>
    );
}

export default QuizHistory;
