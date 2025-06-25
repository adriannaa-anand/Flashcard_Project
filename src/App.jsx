import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Flashcard from "./components/Flashcard";
import Quiz from "./components/Quiz";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";

const allCharacters = [
  { id: 1, question: "ア", answer: "A", fact: "ア is the Katakana character for the 'A' sound.", example: "Example: アイス (ice)" },
  { id: 2, question: "イ", answer: "I", fact: "イ is the Katakana character for the 'I' sound.", example: "Example: イチゴ (strawberry)" },
  { id: 3, question: "ウ", answer: "U", fact: "ウ is the Katakana character for the 'U' sound.", example: "Example: ウサギ (rabbit)" },
  { id: 4, question: "エ", answer: "E", fact: "エ is the Katakana character for the 'E' sound.", example: "Example: エビ (shrimp)" },
  { id: 5, question: "オ", answer: "O", fact: "オ is the Katakana character for the 'O' sound.", example: "Example: オレンジ (orange)" },
  {id: 6, question: "カ", answer: "Ka", fact: "カ is the Katakana character for the 'Ka' sound.", example: "Example: カメラ (camera)"},
  {id: 7, question: "キ", answer: "Ki", fact: "キ is the Katakana character for the 'Ki' sound.", example: "Example: キャンディ (candy)"},
  {id: 8, question: "ク", answer: "Ku", fact: "ク is the Katakana character for the 'Ku' sound.", example: "Example: クッキー (cookie)"},
  {id: 9, question: "ケ", answer: "Ke", fact: "ケ is the Katakana character for the 'Ke' sound.", example: "Example: ケーキ (cake)"},
  {id: 10, question: "コ", answer: "Ko", fact: "コ is the Katakana character for the 'Ko' sound.", example: "Example: コーヒー (coffee)" },
  {id: 11, question: "サ", answer: "Sa", fact: "サ is the Katakana character for the 'Sa' sound.", example: "Example: サンドイッチ (sandwich)"},
  {id: 12, question: "シ", answer: "Shi", fact: "シ is the Katakana character for the 'Shi' sound.", example: "Example: シャワー (shower)"},
  {id: 13, question: "ス", answer: "Su", fact: "ス is the Katakana character for the 'Su' sound.", example: "Example: スープ (soup)"},
  {id: 14, question: "セ", answer: "Se", fact: "セ is the Katakana character for the 'Se' sound.", example: "Example: セーター (sweater)"},
  {id: 15, question: "ソ", answer: "So", fact: "ソ is the Katakana character for the 'So' sound.", example: "Example: ソファー (sofa)"},
  {id: 16, question: "タ", answer: "Ta", fact: "タ is the Katakana character for the 'Ta' sound.", example: "Example: タクシー (taxi)"},
  {id: 17, question: "チ", answer: "Chi", fact: "チ is the Katakana character for the 'Chi' sound.", example: "Example: チョコレート (chocolate)"},
  {id: 18, question: "ツ", answer: "Tsu", fact: "ツ is the Katakana character for the 'Tsu' sound.", example: "Example: ツナ (tuna)"},
  {id: 19, question: "テ", answer: "Te", fact: "テ is the Katakana character for the 'Te' sound.", example: "Example: テーブル (table)"},
  {id: 20, question: "ト", answer: "To", fact: "ト is the Katakana character for the 'To' sound.", example: "Example: トマト (tomato)"},
  {id: 21, question: "ナ", answer: "Na", fact: "ナ is the Katakana character for the 'Na' sound.", example: "Example: ナイフ (knife)"},
  {id: 22, question: "ニ", answer: "Ni", fact: "ニ is the Katakana character for the 'Ni' sound.", example: "Example: ニュース (news)"},
  {id: 23, question: "ヌ", answer: "Nu", fact: "ヌ is the Katakana character for the 'Nu' sound.", example: "Example: ヌードル (noodle)"},
  {id: 24, question: "ネ", answer: "Ne", fact: "ネ is the Katakana character for the 'Ne' sound.", example: "Example: ネクタイ (necktie)"},
  {id: 25, question: "ノ", answer: "No", fact: "ノ is the Katakana character for the 'No' sound.", example: "Example: ノート (notebook)"},
  {id: 26, question: "ハ", answer: "Ha", fact: "ハ is the Katakana character for the 'Ha' sound.", example: "Example: ハンバーガー (hamburger)"},
  {id: 27, question: "ヒ", answer: "Hi", fact: "ヒ is the Katakana character for the 'Hi' sound.", example: "Example: ヒーター (heater)"},
  {id: 28, question: "フ", answer: "Fu", fact: "フ is the Katakana character for the 'Fu' sound.", example: "Example: フォーク (fork)"},
  {id: 29, question: "ヘ", answer: "He", fact: "ヘ is the Katakana character for the 'He' sound.", example: "Example: ヘアバンド (headband)"},
  {id: 30, question: "ホ", answer: "Ho", fact: "ホ is the Katakana character for the 'Ho' sound.", example: "Example: ホテル (hotel)"},
  {id: 31, question: "マ", answer: "Ma", fact: "マ is the Katakana character for the 'Ma' sound.", example: "Example: マフラー (scarf)"},
  {id: 32, question: "ミ", answer: "Mi", fact: "ミ is the Katakana character for the 'Mi' sound.", example: "Example: ミルク (milk)"},
  {id: 33, question: "ム", answer: "Mu", fact: "ム is the Katakana character for the 'Mu' sound.", example: "Example: ムービー (movie)"},
  {id: 34, question: "メ", answer: "Me", fact: "メ is the Katakana character for the 'Me' sound.", example: "Example: メガネ (glasses)"},
  {id: 35, question: "モ", answer: "Mo", fact: "モ is the Katakana character for the 'Mo' sound.", example: "Example: モンキー (monkey)"},
  {id: 36, question: "ヤ", answer: "Ya", fact: "ヤ is the Katakana character for the 'Ya' sound.", example: "Example: ヤク (yak)"},
  {id: 37, question: "ユ", answer: "Yu", fact: "ユ is the Katakana character for the 'Yu' sound.", example: "Example: ユニコーン (unicorn)"},
  {id: 38, question: "ヨ", answer: "Yo", fact: "ヨ is the Katakana character for the 'Yo' sound.", example: "Example: ヨット (yacht)"},
  {id: 39, question: "ラ", answer: "Ra", fact: "ラ is the Katakana character for the 'Ra' sound.", example: "Example: ラジオ (radio)"},
  {id: 40, question: "リ", answer: "Ri", fact: "リ is the Katakana character for the 'Ri' sound.", example: "Example: リンゴ (apple)"},
  {id: 41, question: "ル", answer: "Ru", fact: "ル is the Katakana character for the 'Ru' sound.", example: "Example: ルーム (room)"},
  {id: 42, question: "レ", answer: "Re", fact: "レ is the Katakana character for the 'Re' sound.", example: "Example: レストラン (restaurant)"},
  {id: 43, question: "ロ", answer: "Ro", fact: "ロ is the Katakana character for the 'Ro' sound.", example: "Example: ロボット (robot)"},
  {id: 44, question: "ワ", answer: "Wa", fact: "ワ is the Katakana character for the 'Wa' sound.", example: "Example: ワイン (wine)"},
  {id: 45, question: "ヲ", answer: "Wo", fact: "ヲ is the Katakana character for the 'Wo' sound.", example: "Example: ヲタク (otaku)"},
  {id: 46, question: "ン", answer: "N", fact: "ン is the Katakana character for the 'N' sound.", example: "Example: インド (India)" },
];

function getRandomFlashcards() {
  const shuffled = [...allCharacters].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
}

const App = () => {
  const [userToken, setUserToken] = useState(localStorage.getItem("token"));
  const [studySet, setStudySet] = useState(getRandomFlashcards());

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUserToken(token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserToken(null);
  };

  // When entering flashcards, generate a new random set
  const handleFlashcardsEnter = () => {
    setStudySet(getRandomFlashcards());
  };

  return (
    <Router>
      <div className="App">
        <Navbar userToken={userToken} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard userToken={userToken} setUserToken={setUserToken} />} />
            <Route path="/home" element={userToken ? <Home /> : <Navigate to="/login" />} />
            <Route
              path="/flashcards"
              element={
                userToken ? (
                  <Flashcard list={studySet} onEnter={handleFlashcardsEnter} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/quiz"
              element={
                userToken ? (
                  <Quiz flashcards={studySet} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/login" element={<Login setUserToken={setUserToken} />} />
            <Route path="/register" element={<Register setUserToken={setUserToken} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;