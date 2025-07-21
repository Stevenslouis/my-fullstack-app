import { useState } from "react";
import Modal from "react-modal";
import '../css/CreateQuizMenu.css'
import { createQuiz } from '../services/api'
import { useQuizzes } from '../contexts/QuizContext';


function CreateQuizMenu({ isOpen, onClose}) {

    
    const [questions, setQuestions] = useState([]);
    const [optionCurrForm, setOptionCurrForm] = useState([{
        name: "",
        correct: false
    }, {
        name: "",
        correct: false
    }]);
    const [currentQuestion, setCurrentQuestion] = useState("")
    const [editingQuestion, setEditingQuestion] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [quizName, setQuizName] = useState("")
    

      const { 
        refreshQuizzes,
      } = useQuizzes();

    const addOption = () => {
        setOptionCurrForm([...optionCurrForm, {
            name: "",
            correct: false
        }]);
    };

    const updateItemAtIndex = (index, newValue) => {
        const updatedItems = [...optionCurrForm];
        updatedItems[index].name = newValue;
        setOptionCurrForm(updatedItems);
    };

    const removeOption = (indexinput) => {
        {
            optionCurrForm.length > 2 &&
                setOptionCurrForm(prev =>
                    prev.filter((_, index) => index !== indexinput))
        }
    };

    const addQuestion = () => {
        const hasEmptyOption = optionCurrForm.some(opt => opt.name.trim().toLowerCase() === "");
        const hasEmptyQuestion = currentQuestion.trim() === ""
        const hasTrueOption = optionCurrForm.some(opt => opt.correct)
        const editedOptionList = optionCurrForm.map(opt => opt.name.trim().toLowerCase());
        const askedQuestions = questions.map(quiz => quiz.question.trim().toLowerCase());
        const questionExists = askedQuestions.some(question => question === currentQuestion.trim().toLowerCase())


        if (hasEmptyQuestion) {
            setErrorMsg("There must be a question")
            return;
        } else if (!hasTrueOption) {
            setErrorMsg("press the circle to choose at least one answerr");
            return;
        } else if (hasEmptyOption) {
            setErrorMsg("All options must have a name.");
            return;
        } else if (questionExists) {
            setErrorMsg("This Question already exists");
            return;
        }

        const uniqueAnswers = new Set(editedOptionList);
        if (uniqueAnswers.size !== editedOptionList.length) {
            setErrorMsg("Duplicate correct answers are not allowed.");
            return;
        }

        const correctOptionsList = [...optionCurrForm].filter((opt) => opt.correct).map(opt => opt.name)

        setQuestions([...questions, {
            question: currentQuestion,
            options: [...optionCurrForm],
            answers: correctOptionsList
        }])

        setOptionCurrForm([{
            name: "",
            correct: false
        }, {
            name: "",
            correct: false
        }])
        setCurrentQuestion("")
        setErrorMsg("")
        setEditingQuestion(false)

    }

    const editQuestion = (index, quiz) => {
        !editingQuestion && (
            setEditingQuestion(true),
            setOptionCurrForm([...quiz.options]),
            setCurrentQuestion(quiz.question),
            deleteQuestion(index)
        )
    }

    const deleteQuestion = (indexinput) => {
        setQuestions(prev =>
            prev.filter((_, index) => index !== indexinput)
        );
    }


    const answerToggle = (index, event) => {
        const updatedItems = [...optionCurrForm];

        event.target.checked ? (
            updatedItems[index].correct = true
        ) : (
            updatedItems[index].correct = false
        )
        setOptionCurrForm(updatedItems)
    }

    const resetQuiz = () => {
        setQuestions([])
        setOptionCurrForm([{
            name: "",
            correct: false
        }, {
            name: "",
            correct: false
        }])
        setCurrentQuestion("")
        setErrorMsg("")
        setQuizName("")
    }

    const submitQuiz = () => {
        if (quizName === "") {

            setErrorMsg("Quiz needs a name")

            return
        } else if (questions.length < 1) {
            setErrorMsg("Add A Question")
            return
        }


        const saveQuiz = async () => {
            try {
                const response = await createQuiz({
                    title: quizName,
                    questions: questions
                });
                
                if (response.success === true) {
                await refreshQuizzes()
                onClose()
                } else {
                setErrorMsg("Could not connect to server, quiz not added. ")
                }
            } catch (err) {

                setErrorMsg("Could not connect to server, quiz not added. ")
            } finally {
            }
        };

        saveQuiz()

    }



    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Quiz Menu"
            className="quiz-menu-modal"
            overlayClassName="quiz-modal-overlay"
        >

            <div id="myForm" >
                <div className="left-label-text title">
                    <div>Quiz Name: </div>
                    <label>
                        <input type="text"
                            name="title"
                            className="text-input"
                            onChange={(e) => setQuizName(e.target.value)}
                            value = {quizName}
                            required />
                    </label>
                </div>
                <div className="error-msg" key={errorMsg}>{errorMsg}</div>

                <div className="scrollable">


                    <div className="question-maker">
                        <div className="left-label-text">
                            <div>Question:</div>
                            <label >
                                <input
                                    className="text-input"
                                    type="text"
                                    name="question"
                                    onChange={(e) => setCurrentQuestion(e.target.value.toString())}
                                    value={currentQuestion}
                                    required />
                            </label>
                        </div>

                        <div className="align">

                            {optionCurrForm.map((option, index) => (
                                <div key={index} >

                                    Option {index + 1}
                                    <div className="option-row1">
                                        <input
                                            className="text-input"
                                            type="text"
                                            name="optionz"
                                            onChange={(e) => updateItemAtIndex(index, e.target.value.toString())}
                                            value={option.name}
                                            required
                                        />
                                        <label className="custom-checkbox">
                                            <input type="checkbox" checked={option.correct} onChange={(e) => answerToggle(index, e)} />
                                            <span className="checkmark"></span>

                                        </label>
                                        <button className="delete-btn" type="button" onClick={() => removeOption(index)}>

                                        </button>
                                    </div>

                                </div>

                            ))}

                            <button type="button" className="add-option-btn" onClick={addOption}>
                                +
                            </button>
                        </div>

                        <button className="btn" onClick={addQuestion} >{editingQuestion ? ("SAVE QUESTION") : ("ENTER QUESTION")}</button>
                    </div>

                    <div className="display-questions">
                        {questions && questions.map((quiz, index) => (
                            <div key={index} className="quiz-display">
                                <div>
                                    <div className="truncated-text">Question {index + 1}: {quiz.question}</div>

                                    <div className="truncated-text">answers: {{ ...quiz }.answers.join(", ")}</div>
                                    <div className="truncated-text">options: {{ ...quiz }.options.map(opt => opt.name).join(", ")}</div>
                                </div>
                                <div className="edit-quiz-btns">
                                    <button className="btn" onClick={() => editQuestion(index, quiz)}>EDIT</button>
                                    <button className="delete-btn" onClick={() => deleteQuestion(index)}></button>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
                <div className="quit-reset-btns">
                    <button className="btn" onClick={submitQuiz} >SUBMIT</button>
                    <button className="btn" onClick={resetQuiz}>RESET</button>
                </div>
            </div>

        </Modal>
    );
}

export default CreateQuizMenu;
