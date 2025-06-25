import React, { useState, useEffect } from "react";

function getRandomOptions(flashcards, correctAnswer, count = 4) {
  const incorrect = flashcards
    .map(f => f.answer)
    .filter(ans => ans !== correctAnswer);
  const randomIncorrect = incorrect
    .sort(() => 0.5 - Math.random())
    .slice(0, count - 1);
  const options = [...randomIncorrect, correctAnswer].sort(() => 0.5 - Math.random());
  return options;
}

const Quiz = ({ flashcards }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [options, setOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (flashcards && flashcards.length > 0) {
      setOptions(getRandomOptions(flashcards, flashcards[0].answer));
    }
  }, [flashcards]);

  useEffect(() => {
    if (quizCompleted) return;
    if (timeLeft === 0) {
      setQuizCompleted(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, quizCompleted]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === flashcards[currentQuestionIndex].answer) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (currentQuestionIndex < flashcards.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setOptions(getRandomOptions(flashcards, flashcards[nextIndex].answer));
        setSelectedOption("");
      } else {
        setQuizCompleted(true);
      }
    }, 300);
  };

  if (!flashcards || flashcards.length === 0) {
    return <div>Loading...</div>;
  }

  if (quizCompleted) {
    return (
      <div>
        <h2>Quiz completed!</h2>
        <p>Your score: {score} / {flashcards.length}</p>
      </div>
    );
  }

  const currentQuestion = flashcards[currentQuestionIndex];

  return (
    <div className="center-container">
      <h2>Quiz</h2>
      <div>
        <p>What is the romaji for: <strong>{currentQuestion.question}</strong>?</p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "24px",
            justifyContent: "center",
            margin: "20px 0",
            flexWrap: "wrap"
          }}
        >
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => !selectedOption && handleOptionSelect(option)}
              disabled={!!selectedOption}
              style={{
                minWidth: "120px",
                margin: 0,
                background: selectedOption === option ? "#007bff" : undefined,
                color: selectedOption === option ? "#fff" : undefined,
                fontWeight: "bold",
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div>Time left: {timeLeft} seconds</div>
      <div>
        Question {currentQuestionIndex + 1} of {flashcards.length}
      </div>
    </div>
  );
};

export default Quiz;
