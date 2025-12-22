import { useState } from "react";
import styled, { keyframes } from "styled-components"; // styled-components import
import GameIntro from "./GameIntro";
import GamePlay from "./GamePlay";
import GameOver from "./GameOver";

// 1. 애니메이션 정의 (등장 효과)
const containerFadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// 2. 스타일된 컨테이너 정의
const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #0d1117; /* 공통 배경색 */
  overflow: hidden; /* 스크롤 방지 */
  
  /* 등장 애니메이션 적용 */
  animation: ${containerFadeIn} 0.6s ease-out;
`;

// 게임 상태를 위한 타입 정의
type GameState = "intro" | "playing" | "result" | "loading";


export default function RunningGame() {
  // 제네릭(<...>)을 사용해 상태의 타입을 고정한다.
  // 이제 'intro', 'playing', 'result' 외의 다른 문자열을 넣으면 빨간 줄이 뜨도록
  const [gameState, setGameState] = useState<GameState>("intro");

  const [score, setScore] = useState<number>(0);

  return (
    <GameContainer>
      {/* 1. Intro에서 시작 버튼 누르면 -> Loading으로 이동 */}
      {gameState === "intro" && (
        <GameIntro onStart={() => setGameState("playing")} />
      )}

      {/* 2. Loading이 끝나면 -> Playing으로 이동 */}
      {/* {gameState === "loading" && (
        <GameLoading onLoadComplete={() => setGameState("playing")} />
      )} */}

      {/* 3. Playing에서 죽으면 -> Result로 이동 */}
      {gameState === "playing" && (
        <GamePlay
          // 자식에게 점수(number)를 받아오는 함수임을 명시
          onGameOver={(finalScore: number) => {
            setScore(finalScore);
            setGameState("result");
          }}
        />
      )}

      {/* 4. Result에서 버튼을 누르면 -> HOME 으로 이동*/}
      {gameState === "result" && (
        <GameOver score={score} onRestart={() => setGameState("intro")} />
      )}
    </GameContainer>
  );
}
