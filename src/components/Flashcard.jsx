import React, { useState, useEffect } from "react";

const Flashcard = ({ list, onEnter }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setIsExpanded(false);
  }, [list]);

  useEffect(() => {
    if (onEnter) onEnter();
    // Only run on mount
    // eslint-disable-next-line
  }, []);

  const currentFlashcard = list[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % list.length);
    setIsExpanded(false);
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flashcard">
      <div className="question">
        {currentFlashcard.question}
      </div>
      {isExpanded && (
        <div className="details">
          <p>{currentFlashcard.answer}</p>
          <p>{currentFlashcard.fact}</p>
          <p>{currentFlashcard.example}</p>
        </div>
      )}
      <button onClick={handleToggle}>
        {isExpanded ? "Collapse" : "Expand"}
      </button>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default Flashcard;
