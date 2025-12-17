import React from "react";

const GameOver = ({ status, score, onStart }) => {
  if (status === "READY") {
    return <button onClick={onStart}>게임 시작</button>;
  }

  if (status === "GAMEOVER") {
    return (
      <div className="GameOverMessage">
        <h2>게임 오버!</h2>
        <p>최종 점수 : {score}</p>
        <button onClick={onStart}>한번 더?</button>
      </div>
    );
  }

  return null;
};

export default GameOver;
