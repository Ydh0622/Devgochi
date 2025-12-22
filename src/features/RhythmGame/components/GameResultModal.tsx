import { useEffect, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { useCharacter } from "@/hooks/useCharacter";
import { useNavigate } from "react-router";
import BackGround from "../assets/image/serverBack.png";

// Props 타입 정의
interface GameOverProps {
  score: number;
  bestCombo: number; // 리듬 게임은 콤보가 중요하므로 추가
  onRestart: () => void;
  onSelectMusic: () => void; // 곡 선택으로 돌아가기 기능 추가
}

// --- Animation & Styles (기존과 동일) ---

const textFlicker = keyframes`
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; text-shadow: 0 0 5px #fff, 0 0 10px #4DEEEA, 0 0 20px #4DEEEA, 0 0 40px #0055FF, 0 0 80px #0055FF; }
  20%, 24%, 55% { opacity: 0.1; text-shadow: none; }
`;

const borderPulse = keyframes`
  0% { box-shadow: -4px 0 0 0 #4DEEEA, 4px 0 0 0 #4DEEEA, 0 -4px 0 0 #4DEEEA, 0 4px 0 0 #4DEEEA, 0 0 10px 0 rgba(0, 85, 255, 0.7); }
  50% { box-shadow: -4px 0 0 0 #4DEEEA, 4px 0 0 0 #4DEEEA, 0 -4px 0 0 #4DEEEA, 0 4px 0 0 #4DEEEA, 0 0 40px 10px rgba(0, 85, 255, 0.9); }
  100% { box-shadow: -4px 0 0 0 #4DEEEA, 4px 0 0 0 #4DEEEA, 0 -4px 0 0 #4DEEEA, 0 4px 0 0 #4DEEEA, 0 0 10px 0 rgba(0, 85, 255, 0.7); }
`;

const pixelBorderNeon = css`
  position: relative;
  background: rgba(0, 10, 20, 0.85); /* 가독성을 위해 배경을 조금 더 진하게 */
  margin: 4px;
  animation: ${borderPulse} 3s infinite ease-in-out;

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
  z-index: 1000; /* 리듬게임 요소들보다 위에 뜨도록 z-index 높임 */
  font-family: "Galmuri11", sans-serif;
  color: #fff;
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
`;

const PixelButton = styled.button<{ $primary?: boolean }>`
  font-family: "Galmuri11", sans-serif;
  font-size: 1.1rem;
  background: ${(props) =>
    props.$primary ? "rgba(255, 107, 107, 0.1)" : "rgba(77, 238, 234, 0.1)"};
  color: ${(props) => (props.$primary ? "#FF6B6B" : "#4DEEEA")};
  border: 2px solid ${(props) => (props.$primary ? "#FF6B6B" : "#4DEEEA")};
  padding: 15px 25px;
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

// --- Logic ---

const GameResultModal = ({
  score,
  bestCombo,
  onRestart,
  onSelectMusic,
}: GameOverProps) => {
  const navigate = useNavigate();
  const { gainExp } = useCharacter();

  const isProcessedRef = useRef(false);

  // 예시: (점수 * 0.05) + (최대콤보 * 2)
  const [resultState] = useState(() => {
    const xpFromScore = Math.floor(score * 0.05);
    const xpFromCombo = bestCombo * 2;
    const totalGainedXp = xpFromScore + xpFromCombo;

    return {
      xp: totalGainedXp,
    };
  });

  const [totalXp, setTotalXp] = useState(0);

  useEffect(() => {
    if (!isProcessedRef.current) {
      // 1. 경험치 부여
      gainExp(resultState.xp);

      // 2. 화면에 보여줄 총 경험치 계산 (기존 + 획득)
      const savedTotalXP = localStorage.getItem("exp");
      const currentTotalXP = savedTotalXP ? parseInt(savedTotalXP, 10) : 0;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTotalXp(currentTotalXP);

      isProcessedRef.current = true;
    }
  }, [resultState, gainExp]);

  return (
    <Overlay>
      <ContentWrapper>
        <Title>SESSION CLEAR</Title>

        <ResultBox>
          <ResultRow>
            <span className="label">FINAL SCORE</span>
            <span className="value">{score.toLocaleString()} PTS</span>
          </ResultRow>

          {/* Best Score 대신 Best Combo 표시 */}
          <ResultRow $isHighlight={true}>
            <span className="label">MAX COMBO</span>
            <span className="value">{bestCombo} COMBO</span>
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
        </ResultBox>

        <ButtonGroup>
          <PixelButton onClick={onRestart}>RETRY</PixelButton>
          <PixelButton onClick={onSelectMusic}>MUSIC SELECT</PixelButton>
          <PixelButton $primary onClick={() => navigate("/")}>
            EXIT TO HOME
          </PixelButton>
        </ButtonGroup>
      </ContentWrapper>
    </Overlay>
  );
};

export default GameResultModal;
