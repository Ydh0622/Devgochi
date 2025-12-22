import { useEffect, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import BackGround from "./assets/serverBack.png";
import { useCharacter } from "@/hooks/useCharacter";
import { useNavigate } from "react-router";

// Props 타입 정의
interface GameOverProps {
  score: number;
  onRestart: () => void;
}

interface GameRecord {
  score: number;
  date: string;
}

// GameIntro와 거의 동일

// --- 네온 효과를 주기위한 애니메이션 ---
// 네온 상태에서 깜빡이도록
const textFlicker = keyframes`
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    opacity: 1;
    text-shadow: 
      0 0 5px #fff,
      0 0 10px #4DEEEA,
      0 0 20px #4DEEEA,
      0 0 40px #0055FF,
      0 0 80px #0055FF;
  }
  20%, 24%, 55% {
    opacity: 0.1;
    text-shadow: none;
  }
`;

// 박스 테두리 빛이 퍼졌다 줄어들었다 함
const borderPulse = keyframes`
  0% { 
    box-shadow: 
      -4px 0 0 0 #4DEEEA, 4px 0 0 0 #4DEEEA, 
      0 -4px 0 0 #4DEEEA, 0 4px 0 0 #4DEEEA,
      0 0 10px 0 rgba(0, 85, 255, 0.7); 
  }
  50% { 
    box-shadow: 
      -4px 0 0 0 #4DEEEA, 4px 0 0 0 #4DEEEA, 
      0 -4px 0 0 #4DEEEA, 0 4px 0 0 #4DEEEA,
      0 0 40px 10px rgba(0, 85, 255, 0.9); /* 빛이 제일 강하게 퍼짐 */
  }
  100% { 
    box-shadow: 
      -4px 0 0 0 #4DEEEA, 4px 0 0 0 #4DEEEA, 
      0 -4px 0 0 #4DEEEA, 0 4px 0 0 #4DEEEA,
      0 0 10px 0 rgba(0, 85, 255, 0.7); 
  }
`;

// --- 픽셀 박스 스타일 ---
const pixelBorderNeon = css`
  position: relative;
  background: rgba(0, 10, 20, 0.6); /* 아주 어두운 남색 배경 */
  margin: 4px;

  /* 숨쉬는 애니메이션 적용 */
  animation: ${borderPulse} 3s infinite ease-in-out;

  /* 모서리 계단 처리  */
  &::after {
    content: "";
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    box-shadow:
      -4px 0 0 0 #4deeea,
      4px 0 0 0 #4deeea,
      0 -4px 0 0 #4deeea,
      0 4px 0 0 #4deeea;
    z-index: -1;
  }
`;

// --- 컴포넌트 스타일 정의 ---

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background-image: url(${BackGround});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  font-family: "Galmuri11", sans-serif;
  color: #fff;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 0;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-height: 90vh;
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin: 0;
  line-height: 1.2;
  text-align: center;
  color: #f0ffff;
  animation: ${textFlicker} 4s infinite;
`;

const ResultBox = styled.div`
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  ${pixelBorderNeon}
`;

const ResultRow = styled.div<{ $isHighlight?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  padding-bottom: 15px;
  border-bottom: 2px dashed rgba(96, 255, 255, 0.3);

  color: ${(props) => (props.$isHighlight ? "#FFD700" : "#fff")};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .label {
    color: #4deeea;
    text-shadow: 0 0 10px rgba(0, 153, 255, 0.5);
  }

  .value {
    font-size: 1.4rem;
    text-shadow: 2px 2px 0 #000;
  }
`;

const NewRecordBadge = styled.span`
  background-color: #ff6b6b;
  color: white;
  font-size: 0.7rem;
  padding: 3px 6px;
  margin-left: 10px;
  box-shadow: 2px 2px 0 #000;
  animation: blink 0.8s steps(2, start) infinite;

  @keyframes blink {
    to {
      visibility: hidden;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  width: 100%;
  justify-content: center;
`;

const PixelButton = styled.button<{ $primary?: boolean }>`
  font-family: "Galmuri11", sans-serif;
  font-size: 1.2rem;
  background: ${(props) =>
    props.$primary ? "rgba(255, 107, 107, 0.1)" : "rgba(77, 238, 234, 0.1)"};
  color: ${(props) => (props.$primary ? "#FF6B6B" : "#4DEEEA")};
  border: 2px solid ${(props) => (props.$primary ? "#FF6B6B" : "#4DEEEA")};
  padding: 15px 30px;
  cursor: pointer;
  position: relative;

  box-shadow:
    inset 0 0 10px
      ${(props) =>
        props.$primary
          ? "rgba(255, 107, 107, 0.3)"
          : "rgba(77, 238, 234, 0.3)"},
    0 0 10px rgba(0, 0, 0, 0.5);
  text-shadow: 0 0 5px
    ${(props) =>
      props.$primary ? "rgba(255, 107, 107, 0.5)" : "rgba(77, 238, 234, 0.5)"};

  transition: all 0.1s;

  &:hover {
    transform: translate(-2px, -2px);
    background: ${(props) => (props.$primary ? "#FF6B6B" : "#4DEEEA")};
    color: #000;
    text-shadow: none;
    box-shadow:
      0 0 20px ${(props) => (props.$primary ? "#FF6B6B" : "#4DEEEA")},
      4px 4px 0px 0px #000;
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: none;
  }
`;

// --- 4. Logic & Component ---

const GameOver = ({ score, onRestart }: GameOverProps) => {
  const navigate = useNavigate();
  const { gainExp } = useCharacter();

  // 중복 실행 방지
  const isProcessedRef = useRef(false);

  // [핵심] 컴포넌트 마운트 시 1회만 계산 및 상태 초기화
  const [resultState] = useState(() => {
    // 1. 기존 랭킹 불러오기 (없으면 빈 배열)
    const savedRecordsJSON = localStorage.getItem("runningGameRecords");
    const savedRecords: GameRecord[] = savedRecordsJSON
      ? JSON.parse(savedRecordsJSON)
      : [];

    // 2. 현재 최고 점수 (비교용)
    const previousBestScore =
      savedRecords.length > 0 ? savedRecords[0].score : 0;

    // 3. 오늘 날짜 포맷팅 (YY.MM.DD)
    const today = new Date();
    const formattedDate = `${today.getFullYear().toString().slice(2)}.${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.${today.getDate().toString().padStart(2, "0")}`;

    // 4. 새로운 랭킹 리스트 생성
    const newRecord = { score, date: formattedDate };
    // 기존 목록에 추가 -> 점수 내림차순 정렬
    const updatedRecords = [...savedRecords, newRecord].sort(
      (a, b) => b.score - a.score
    );
    // 상위 5개만 자르기
    const top5Records = updatedRecords.slice(0, 5);

    // 5. 신기록 여부 판별 (0번 인덱스가 나 자신이면서, 이전 최고점수보다 높을 때)
    // 혹은 단순히 "현재 점수가 1등인지"만 확인해도 됨
    const isNewRecord = score > previousBestScore;

    // 6. 결과 객체 반환 (렌더링에 사용할 값들)
    return {
      xp: Math.floor(score * 0.1),
      top5Records, // 로컬스토리지에 저장할 최종 리스트
      bestScore: top5Records[0].score, // 현재 1등 점수
      isNewRecord, // NEW 뱃지용
    };
  });

  const [totalXp, setTotalXp] = useState(0);

  useEffect(() => {
    if (!isProcessedRef.current) {
      // 1. 로컬스토리지에 랭킹 저장 (Top 5)
      localStorage.setItem(
        "runningGameRecords",
        JSON.stringify(resultState.top5Records)
      );

      // 2. 경험치 부여 및 토탈 경험치 계산
      gainExp(resultState.xp);
      const savedTotalXP = localStorage.getItem("exp");
      const currentTotalXP = savedTotalXP ? parseInt(savedTotalXP, 10) : 0;

      // 화면 표시용 state 업데이트
      setTotalXp(currentTotalXP);

      isProcessedRef.current = true;
    }
  }, [resultState, gainExp]);

  return (
    <Overlay>
      <ContentWrapper>
        <Title>SESSION TERMINATED</Title>

        <ResultBox>
          <ResultRow>
            <span className="label">FINAL SCORE</span>
            <span className="value">{score.toLocaleString()} PTS</span>
          </ResultRow>
          <ResultRow>
            <span className="label">EXP GAINED</span>
            <span
              className="value"
              style={{ color: "#0f0", textShadow: "0 0 10px #0f0" }}
            >
              +{resultState.xp.toLocaleString()} XP
            </span>
          </ResultRow>
          <ResultRow>
            <span className="label">TOTAL EXP</span>
            <span className="value">{totalXp.toLocaleString()} XP</span>
          </ResultRow>
          <ResultRow $isHighlight={true}>
            <span className="label">BEST RECORD</span>
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* 현재 저장된 랭킹 중 1등 점수 표시 */}
              <span className="value">
                {resultState.bestScore.toLocaleString()} PTS
              </span>
              {resultState.isNewRecord && <NewRecordBadge>NEW!</NewRecordBadge>}
            </div>
          </ResultRow>
        </ResultBox>

        <ButtonGroup>
          <PixelButton onClick={onRestart}>SYSTEM REBOOT</PixelButton>
          <PixelButton $primary onClick={() => navigate("/")}>
            EXIT TO HOME
          </PixelButton>
        </ButtonGroup>
      </ContentWrapper>
    </Overlay>
  );
};

export default GameOver;
