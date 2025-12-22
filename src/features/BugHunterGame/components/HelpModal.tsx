import styled, { keyframes } from "styled-components";

const MAIN_CYAN = "#60FFFF";
const NEON_BLUE = "rgba(0, 85, 255, 0.7)";
const BUG_RED = "#FF4444";
const CODE_GREEN = "#44FF44";

// --- 애니메이션 ---

// 1. 아이템이 떨어져서 분류되는 애니메이션 (4초 주기)
// 0~2초: 정상 코드(초록) -> 왼쪽으로
// 2~4초: 버그(빨강) -> 오른쪽으로
const sortSimulation = keyframes`
  0% { transform: translate(-50%, -100%); opacity: 0; background: ${CODE_GREEN}; box-shadow: 0 0 10px ${CODE_GREEN}; }
  10% { transform: translate(-50%, 0); opacity: 1; } /* 중앙 도착 */
  20% { transform: translate(-50%, 0); opacity: 1; } /* 대기 */
  40% { transform: translate(-250%, 0); opacity: 0; background: ${CODE_GREEN}; } /* 왼쪽으로 사라짐 */
  
  49.9% { opacity: 0; }
  
  50% { transform: translate(-50%, -100%); opacity: 0; background: ${BUG_RED}; box-shadow: 0 0 10px ${BUG_RED}; }
  60% { transform: translate(-50%, 0); opacity: 1; } /* 중앙 도착 */
  70% { transform: translate(-50%, 0); opacity: 1; } /* 대기 */
  90% { transform: translate(150%, 0); opacity: 0; background: ${BUG_RED}; } /* 오른쪽으로 사라짐 */
  100% { opacity: 0; }
`;

// 2. 왼쪽 키 눌림 효과 (0~2초 구간에 반응)
const leftKeyPress = keyframes`
  0%, 25% { transform: translateY(0); box-shadow: 0 4px 0 #444; color: #ccc; border-color: #666; }
  30% { transform: translateY(4px); box-shadow: 0 0 0 #444; color: ${CODE_GREEN}; border-color: ${CODE_GREEN}; } /* 눌림 */
  35%, 100% { transform: translateY(0); box-shadow: 0 4px 0 #444; color: #ccc; border-color: #666; }
`;

// 3. 오른쪽 키 눌림 효과 (2~4초 구간에 반응)
const rightKeyPress = keyframes`
  0%, 75% { transform: translateY(0); box-shadow: 0 4px 0 #444; color: #ccc; border-color: #666; }
  80% { transform: translateY(4px); box-shadow: 0 0 0 #444; color: ${BUG_RED}; border-color: ${BUG_RED}; } /* 눌림 */
  85%, 100% { transform: translateY(0); box-shadow: 0 4px 0 #444; color: #ccc; border-color: #666; }
`;

const typing = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

const blink = keyframes`
  50% { border-color: transparent }
`;

// --- 스타일 컴포넌트 ---

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
`;

const ModalBox = styled.div`
  position: relative;
  width: 90%;
  max-width: 600px;
  background: rgba(0, 10, 20, 0.95);
  padding: 2rem;
  font-family: "Galmuri11", sans-serif;
  color: #fff;
  box-shadow:
    -4px 0 0 0 ${MAIN_CYAN},
    4px 0 0 0 ${MAIN_CYAN},
    0 -4px 0 0 ${MAIN_CYAN},
    0 4px 0 0 ${MAIN_CYAN},
    0 0 20px ${NEON_BLUE};

  &::after {
    content: "";
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    box-shadow:
      -4px 0 0 0 ${MAIN_CYAN},
      4px 0 0 0 ${MAIN_CYAN},
      0 -4px 0 0 ${MAIN_CYAN},
      0 4px 0 0 ${MAIN_CYAN};
    z-index: -1;
  }
`;

const Header = styled.h2`
  text-align: center;
  font-size: 2rem;
  color: ${MAIN_CYAN};
  text-shadow: 0 0 10px ${NEON_BLUE};
  margin-bottom: 2rem;
  border-bottom: 2px dashed rgba(96, 255, 255, 0.3);
  padding-bottom: 1rem;
`;

// 게임 시뮬레이션 (분류 동작)
const DemoStage = styled.div`
  width: 100%;
  height: 150px;
  background: #111;
  border: 2px solid #333;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;

  /* 중앙 기준선 */
  &::before {
    content: "";
    position: absolute;
    top: 10%;
    bottom: 10%;
    width: 2px;
    background: repeating-linear-gradient(
      to bottom,
      #333 0,
      #333 10px,
      transparent 10px,
      transparent 20px
    );
  }
`;

// 분류되는 아이템 (코드/버그)
const DemoItem = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  width: 50px;
  height: 50px;
  border: 2px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  font-weight: bold;

  /* 애니메이션 적용 */
  animation: ${sortSimulation} 4s infinite ease-in-out;
`;

const ControlSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  align-items: center;
  margin-bottom: 2rem;
`;

// 키캡 스타일
const KeyGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const KeyCap = styled.div<{ $isLeft?: boolean }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  font-family: monospace;
  font-size: 2rem;
  color: #ccc;
  border: 2px solid #666;
  border-radius: 8px;
  border-bottom-width: 6px;
  background: #222;

  /* 키 별 애니메이션 할당 */
  animation: ${(props) => (props.$isLeft ? leftKeyPress : rightKeyPress)} 4s
    infinite;
`;

const KeyLabel = styled.span<{ $color: string }>`
  font-size: 0.9rem;
  color: ${(props) => props.$color};
  text-shadow: 0 0 5px ${(props) => props.$color};
`;

const Description = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #ddd;
  text-align: center;

  p {
    margin: 0 auto;
    letter-spacing: 0.05em;
  }

  .typing-effect {
    animation:
      ${typing} 2.5s steps(30, end),
      ${blink} 0.75s step-end infinite;
    border-right: 3px solid ${MAIN_CYAN};
    width: 100%;
    max-width: fit-content;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const CloseButton = styled.button`
  display: block;
  margin: 2rem auto 0;
  background: transparent;
  color: ${MAIN_CYAN};
  border: 2px solid ${MAIN_CYAN};
  padding: 10px 30px;
  font-family: inherit;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

  &:hover {
    background: ${MAIN_CYAN};
    color: #000;
    box-shadow: 0 0 15px ${MAIN_CYAN};
  }
`;

// --- 컴포넌트 ---

interface HelpModalProps {
  onClose: () => void;
}

const GameHelpModal = ({ onClose }: HelpModalProps) => {
  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <Header>OPERATION MANUAL</Header>

        {/* 1. 분류 시뮬레이션 */}
        <DemoStage>
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              fontSize: "0.8rem",
              color: "#666",
            }}
          >
            :: SORTING_SIMULATION.exe ::
          </div>

          {/* 애니메이션 되는 아이템 (4초마다 색상/방향 바뀜) */}
          <DemoItem>DATA</DemoItem>

          {/* 가이드 화살표 */}
          <div
            style={{
              position: "absolute",
              left: "20%",
              color: CODE_GREEN,
              opacity: 0.5,
            }}
          >
            ◀ SAVE
          </div>
          <div
            style={{
              position: "absolute",
              right: "20%",
              color: BUG_RED,
              opacity: 0.5,
            }}
          >
            DEL ▶
          </div>
        </DemoStage>

        {/* 2. 조작키 */}
        <ControlSection>
          {/* 왼쪽 키 */}
          <KeyGroup>
            <KeyCap $isLeft>⬅️</KeyCap>
            <KeyLabel $color={CODE_GREEN}>정상 코드</KeyLabel>
          </KeyGroup>

          {/* 오른쪽 키 */}
          <KeyGroup>
            <KeyCap>➡️</KeyCap>
            <KeyLabel $color={BUG_RED}>악성 버그</KeyLabel>
          </KeyGroup>
        </ControlSection>

        {/* 3. 설명 */}
        <Description>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p className="typing-effect">
              코드는 저장하고, 버그는 제거하십시오.
            </p>
          </div>
          <p style={{ marginTop: "10px", fontSize: "0.85rem", color: "#888" }}>
            연속 성공 시 콤보 보너스 획득 가능
          </p>
        </Description>

        <CloseButton onClick={onClose}>닫기 (CLOSE)</CloseButton>
      </ModalBox>
    </Overlay>
  );
};

export default GameHelpModal;
