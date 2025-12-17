// 기능별 분류
import React, { useState, useEffect } from "react";
import SortItem from "./components/SortItem.jsx";
import ScoreBoard from "./components/ScoreBoard.jsx";
import GameOverlay from "./components/Gameover.jsx";
import Decoration from "./components/Decoration.jsx";
import { GAME_CONFIG, getStaticY } from "./constants.js";
import "./CSS/BugHunter.css";
import BackgroundImage from "./images/rail_background.png";

// 코드,버그 생성을 위한 변수
let nextId = 0;

// 상태관리(핵심 데이터)
const BugHunter = () => {
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("READY");
  const [characters, setCharacters] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isPausedForGameOver, setIsPausedForGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const startGame = () => {
    setScore(0);
    setIsPausedForGameOver(false);
    setFeedback(null);
    setTimeLeft(60);

    const initialCharacters = Array.from({ length: 15 }, (_, index) => ({
      id: nextId++,
      type: Math.random() < 0.5 ? "정상코드" : "버그",
      x: GAME_CONFIG.RAIL_CENTER_X,
      y: getStaticY(index),
    }));

    setCharacters(initialCharacters);
    setStatus("PLAYING");
  };

  const endGame = () => setStatus("GAMEOVER");

  // 타이머
  useEffect(() => {
    if (status !== "PLAYING") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  // 피드백/지연
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 500);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  useEffect(() => {
    if (isPausedForGameOver) {
      const timer = setTimeout(() => {
        endGame();
        setIsPausedForGameOver(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isPausedForGameOver]);

  // 입력 판정
  useEffect(() => {
    if (status !== "PLAYING" || isPausedForGameOver) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const target = characters[0];
        const isCorrect =
          (e.key === "ArrowLeft" && target.type === "정상코드") ||
          (e.key === "ArrowRight" && target.type === "버그");

        if (isCorrect) {
          setScore((s) => s + 10);
          setFeedback("correct");
          setCharacters((prev) => {
            const remaining = prev
              .slice(1)
              .map((c, i) => ({ ...c, y: getStaticY(i) }));
            const newChar = {
              id: nextId++,
              type: Math.random() < 0.5 ? "정상코드" : "버그",
              x: GAME_CONFIG.RAIL_CENTER_X,
              y: getStaticY(remaining.length),
            };
            return [...remaining, newChar];
          });
        } else {
          setFeedback("incorrect");
          setIsPausedForGameOver(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, characters, isPausedForGameOver]);

  return (
    <div className="BugHunterContainer">
      <Decoration status={status} />
      <ScoreBoard score={score} timeLeft={timeLeft} status={status} />
      <GameOverlay status={status} score={score} onStart={startGame} />

      {status === "PLAYING" && (
        <div
          className={`PlayArea ${feedback || ""}`}
          style={{ "--bg-image": `url(${BackgroundImage})` }}
        >
          {characters.map((char) => (
            <SortItem
              key={char.id}
              data={char}
              style={{ opacity: isPausedForGameOver ? 0.5 : 1 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BugHunter;
