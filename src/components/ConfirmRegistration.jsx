import { useEffect, useState } from "react";
import Modal from "react-modal";
import '../css/DeleteQuiz.css'


function ConfirmRegistration({isOpen, onClose, registerFunction}) {

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Delete Quiz Modal"
            className="delete-quiz-modal"
            overlayClassName="quiz-modal-overlay"
        >
        <div className="content">
            <div>Double check email is valid. Valid email is required for future account recovery.</div>
            <div className="deletequiz-btns">
                <button className="btn" onClick={onClose} >Go Back</button>
                <button className="btn" onClick={registerFunction}>Register</button>
            </div>
        </div>
        </Modal >
    )
}
export default ConfirmRegistration
