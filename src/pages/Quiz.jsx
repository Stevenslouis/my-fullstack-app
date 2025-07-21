import "../css/Quiz.css";
import { useState, useEffect } from "react";
import QuizMenu from '../components/QuizMenu'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuizzes } from '../contexts/QuizContext';
import { uploadQuiz } from "../services/api";

function Quiz() {
    const quiz_navigate = useNavigate();
    const { quizId } = useParams();
    const { quizzes } = useQuizzes();

    const quiz = quizzes.find(q => q._id === quizId);

    useEffect(() => {
        if (!quiz) {
            quiz_navigate("/home");
        }
    }, [quiz]);

    if (!quiz) return null;

    const [userQuiz, setUserQuiz] = useState(() => ({
        ...quiz,
        questions: quiz.questions.map(q => ({
            ...q,
            options: q.options.map(opt => ({ ...opt, correct: false }))
        }))
    }));
    const [quizFinished, setQuizFinished] = useState(false);
    const [quizIndex, setQuizIndex] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("")

    const currentQuestion = quiz.questions[quizIndex];
    const isMultipleChoice = currentQuestion.options.filter(option => option.correct).length > 1;

    const numAnsweredQuestions = userQuiz.questions.filter(
        q => q.options.some(o => o.correct)
    ).length;

    const selectedAnswers = userQuiz.questions.map(
        q => q.options.some(o => o.correct)
    );

    const progress = Math.floor(numAnsweredQuestions / quiz.questions.length * 100);

    const handleOptionChange = (optionIndex) => {
        setUserQuiz(prev => {
            const newQuiz = JSON.parse(JSON.stringify(prev)); // deep clone

            const currentQuestion = newQuiz.questions[quizIndex];
            const currentOptions = currentQuestion.options;

            if (isMultipleChoice) {
                // Toggle this option only
                currentOptions[optionIndex].correct = !currentOptions[optionIndex].correct;
            } else {
                // Single choice: make only this one true
                currentOptions.forEach((option, i) => {
                    option.correct = (i === optionIndex);
                });
            }

            return newQuiz;
        });
    };


    const navigate = (direction) => {
        if (direction === 'next' && quizIndex < quiz.questions.length - 1) {
            setQuizIndex(prev => prev + 1);
        } else if (direction === 'prev' && quizIndex > 0) {
            setQuizIndex(prev => prev - 1);
        } else if (direction === 'next') {
            setQuizFinished(true);
        }
    };

    const goToQuestion = (index) => {
        setQuizFinished(false);
        setQuizIndex(index);
        setMenuOpen(false);
    };

    const goToSubmit = () => {
        setQuizFinished(true);
        setMenuOpen(false);
    };

    const QuizHeader = () => (
        <div className="buttons">
            <button type="button" className="btn" onClick={exitQuiz}>Exit</button>
            <button type="button" className="btn" onClick={() => setMenuOpen(true)}>Menu</button>
        </div>
    );

    const submitQuiz = () => {

        if (progress !== 100) return;

        const comparison = quiz.questions.map((question, index) => {
            const original = JSON.stringify(question.options);
            const current = JSON.stringify(userQuiz.questions[index].options);
            return original === current;
        });

        const score = Math.floor(comparison.filter((index) => index).length / comparison.length * 100)

        const returnClassName = (qindex, oindex) => {

            const quizAnswer = { ...quiz }.questions[qindex].options[oindex].correct
            const userAnswer = { ...userQuiz }.questions[qindex].options[oindex].correct
            const multipleAnswer = {...quiz }.questions[qindex].answers.length > 1

            if (quizAnswer === true && userAnswer === true) {
                return "green"
            } else if
                (quizAnswer === true && userAnswer === false && multipleAnswer) {
                return "yellow"
            } else if
                (quizAnswer === true && userAnswer === false) {
                return "green"
            } else if
                (quizAnswer === false && userAnswer === true) {
                return "red"
            } else {
                return " "
            }
        }

        const display = { ...userQuiz }.questions.map(({ ...question }, qindex) => {
            return {
                title: question.question,
                questions: question.options.map(({ ...option }, oindex) => { return [option.name, returnClassName(qindex, oindex)] })
            }
        })

        // console.log({
        //     quizId: { ...quiz }._id,
        //     quizName: { ...quiz }.title,
        //     quizInfo: display,
        //     score: score
        // });


        const saveQuiz = async () => {
            try {
                const response = await uploadQuiz({
                    quizId: { ...quiz }._id,
                    quizName: { ...quiz }.title,
                    quizInfo: display,
                    score: score
                });


                if (response.success === true) {
                    quiz_navigate('/home')
                } else {
                    setErrorMsg(response.message)
                }
            } catch (err) {
                setErrorMsg("Unable to connect server. Quiz not saved")
            } finally {
            }
        };

        saveQuiz()

    };

    const exitQuiz = () => quiz_navigate("/home");

    return (
        <div className="background-quiz">
            <div className="quiz-container">
                {quizFinished ? (
                    <div className="form stretch">
                        <QuizHeader />
                        <div>
                            {progress === 100
                                ? (errorMsg ? errorMsg: "Press Submit to Submit Quiz")
                                : "Not all questions have been answered, review the question statuses in the menu and go back to complete unfinished questions"}
                        </div>
                        <div className="bottom-buttons">
                            <button type="button" className="btn" onClick={() => { setQuizFinished(false); setQuizIndex(quiz.questions.length - 1); }}>Prev</button>
                            {progress === 100 && <button type="button" className="btn" onClick={submitQuiz}>Submit</button>}
                        </div>
                    </div>
                ) : (
                    <div className="form">
                        <QuizHeader />
                        <div className="question-label">Question {quizIndex + 1}:</div>
                        <div className="question">{currentQuestion.question}</div>
                        {isMultipleChoice && <div className="num-answers">(There's more than one answer)</div>}
                        {userQuiz.questions[quizIndex].options.map((option, index) => (
                            <div key={option.name} className="option-row">
                                <input
                                    type={isMultipleChoice ? "checkbox" : "radio"}
                                    className="option"
                                    id={option.name}
                                    checked={option.correct}
                                    onChange={() => handleOptionChange(index)}
                                />
                                <label htmlFor={option.name} className="text-label">{option.name}</label>
                            </div>
                        ))}
                        <div className="bottom-buttons">
                            <button type="button" className="btn" onClick={() => navigate('prev')}>Previous</button>
                            <button type="button" className="btn" onClick={() => navigate('next')}>Next</button>
                        </div>
                    </div>
                )}
                <QuizMenu
                    isOpen={menuOpen}
                    onClose={() => setMenuOpen(false)}
                    onExit={exitQuiz}
                    progress={progress}
                    answeredCount={numAnsweredQuestions}
                    total={quiz.questions.length}
                    selectedAnswers={selectedAnswers}
                    goToQuestion={goToQuestion}
                    goToSubmit={goToSubmit}
                />
            </div>
        </div>
    );
}

export default Quiz;
