import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="center-container">
      <h2>Welcome to Katakana Flashcards & Quiz</h2>
      <button onClick={() => navigate("/flashcards")}>Flashcards</button>
      <button onClick={() => navigate("/quiz")}>Quiz</button>
    </div>
  );
};

export default Home;
