import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ userToken, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <h2>Katakana Flashcards & Quiz</h2>
      <div className="nav-buttons">
        <button onClick={() => navigate("/flashcards")}>Flashcards</button>
        {userToken && <button onClick={() => navigate("/quiz")}>Quiz</button>}
        {!userToken ? (
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </>
        ) : (
          <button onClick={() => { onLogout(); navigate("/login"); }}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
