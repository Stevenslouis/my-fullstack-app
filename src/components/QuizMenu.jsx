import React from "react";
import Modal from "react-modal";
import "../css/QuizMenu.css";
function QuizMenu({ isOpen, onClose, onExit, progress, answeredCount, total , selectedAnswers, goToQuestion, goToSubmit}) {
  
 
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose} // allows ESC key and click outside to close
      contentLabel="Quiz Menu"
      className="quiz-modal"
      overlayClassName="quiz-modal-overlay"
    >
      <h2>Quiz Menu</h2>
      <p>Progress: {progress}%</p>
      <p>Questions Answered: {answeredCount} / {total}</p>
      <div className="scrollable-text">

        {selectedAnswers.map((answers, index) => (

            <div className="row-space answered-info" key = {index}>
                <div className="question-number">Question {index+1}:</div>
                {answers? 
                <div className="green">Answered</div>:
                <div className="red">Not Answered</div>}
                <button className="answered-row"
                 type="button"
                 onClick={()=> goToQuestion(index)}
                 >Go To Question</button>
            </div>
        ))}
      </div>

      <div className="quiz-menu-buttons">
        <button onClick={onClose}>Resume</button>
         <button onClick={goToSubmit}>Submit</button>
        <button onClick={onExit}>Exit Quiz</button>
        
      </div>
    </Modal>
  );
}

export default QuizMenu;
