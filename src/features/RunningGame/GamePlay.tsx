import { useState, useRef, useCallback, useEffect } from "react";
import Character from "./components/Character";
import Obstacle from './components/Obstacle';
// import Item from './components/Item';
import Background from "./components/BackGround";

import styled from "styled-components";

const GameContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  cursor: pointer;
  overflow: hidden;
`;
interface GamePlayProps {
  onGameOver: (finalScore: number) => void;
}

// onGameOver로 finalScore 값을 부모로 넘겨줘야함
const GamePlay = ({ onGameOver }: GamePlayProps) => {
  // Character 컴포넌트에 전달할 점프 상태
  const [isJumping, setIsJumping] = useState<boolean>(false);
  // 시각적 효과를 위한 상태 (캐릭터 깜빡임용)
  const [isInvincible, setIsInvincible] = useState<boolean>(false);
  // 점수 표시를 위한 상태
  const [score, setScore] = useState<number>(0);
  // 생명 (3개)를 위한 상태
  const [hearts, setHearts] = useState<number>(3);

  // ref 생성 (부모에서 생성해야지 자식 컴포넌트의 위치를 확인할 수 있음)
  const playerRef = useRef<HTMLDivElement>(null);
  const obstacleRef = useRef<HTMLDivElement>(null);
  // 충돌 감지
  const isHitRef = useRef(false);

  // 점프 함수
  const jump = useCallback(() => {
    // 이미 점프 중이면 무시 (이단 점프 방지)
    if (isJumping) return;

    setIsJumping(true);

    // 캐릭터 애니메이션 시간(0.5s)과 똑같이 맞춰서 false로 되돌림
    setTimeout(() => {
      setIsJumping(false);
    }, 700);
  }, [isJumping]); // isJumping이 바뀔 때만 함수 갱신

  // 스페이스바 눌렀을 때 점프하도록 window 객체에 이벤트 리스너 등록하기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault(); // 스페이스바 누르면 화면 스크롤 내려가는 거 막기
        jump();
      }
    };

    // 마운트 될 때 리스너 붙이기
    window.addEventListener("keydown", handleKeyDown);
    // 언마운트 될 때 리스너 떼기 (메모리 누수 방지)
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [jump]); // jump 함수가 바뀌면 리스너도 다시 등록

  // 0.1초 마다 점수 갱신 로직
  useEffect(() => {
    const scoreTimer = setInterval(() => {
      setScore((prev) => prev + 10) // 0.1초 지날 때마다 10점씩 증가
    }, 100)
    
    if(score == 0) clearInterval(scoreTimer)

    return () => {
      clearInterval(scoreTimer)
    }
  }, [score])

  // 0.01초 마다 충돌 감지
  useEffect(() => {
    const collisionTimer = setInterval(() => {
      // DOM 위치가 없다면
      if( !playerRef.current || !obstacleRef.current) return

      const player = playerRef.current.getBoundingClientRect();
      const obstacle = obstacleRef.current.getBoundingClientRect();

      // 충돌 판단 로직
      const isCollision = (
        player.right > obstacle.left + 10 &&
        player.left < obstacle.right - 10 &&
        player.bottom > obstacle.top &&
        player.top < obstacle.bottom
      );

      // 충돌이 발생했고 충돌 중이 아니라면
      if (isCollision && !isHitRef.current) {
        
        // (1) 충돌 중임을 ref를 통해서 알리기 (비동기 처리되는 state와 다르게 바로 반영됨)
        isHitRef.current = true;

        // (2) 데이터 업데이트 (하트 깎기) -> 여기서 리렌더링 1회 발생 (state가 달라졌기 때문)
        setHearts((prev) => {
          const newHeart = prev - 1;
          if (newHeart <= 0) {
             setScore(0)
             clearInterval(collisionTimer);
             onGameOver(score); // 게임 오버
          }
          return newHeart;
        });

        // (3) 시각적 효과 켜기 (깜빡임 애니메이션용)
        setIsInvincible(true);

        // (4) 1초 뒤에 깃발 뽑기 (무적 해제)
        setTimeout(() => {
          isHitRef.current = false; // 다시 충돌 가능
          setIsInvincible(false);   // 깜빡임 멈춤
        }, 1000);
      }
    }, 10);
  
    return () => {
      clearInterval(collisionTimer);
    };
    },[onGameOver])

  return (
    <GameContainer onClick={jump}>
      <Background /> {/* 배경은 ref 필요 없음 */}
      {/* 2. UI 요소 (화면 맨 위) */}
      {/* <UIHeader>
       <HeartContainer>...</HeartContainer>
       <ScoreBoard>...</ScoreBoard>
    </UIHeader> */}
      <Character ref={playerRef} isJumping={isJumping} isInvincible={isInvincible}/>
      <Obstacle ref={obstacleRef} />
      
      {/*<Item ... /> */}
    </GameContainer>
  );
};

export default GamePlay;
