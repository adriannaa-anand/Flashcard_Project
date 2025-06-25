import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import '../index.css'; 

const Dashboard = ({ userToken, setUserToken }) => {
  const navigate = useNavigate();

  if (userToken) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="center-container">
      <h1>Welcome to Katakana Flashcards & Quiz</h1>
      <button onClick={() => navigate("/register")}>Register</button>
      <button onClick={() => navigate("/login")}>Login</button>
    </div>
  );
};

export default Dashboard;
