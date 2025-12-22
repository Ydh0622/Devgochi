import styled, { keyframes } from "styled-components";

const MAIN_CYAN = "#60FFFF";
const NEON_BLUE = "rgba(0, 85, 255, 0.7)";
const HIT_PINK = "#FF6B6B";

// --- 애니메이션 ---

// 1. 노트가 떨어지는 애니메이션 (무한 반복)
const noteFall = keyframes`
  0% { top: -20%; opacity: 0; }
  10% { opacity: 1; }
  75% { top: 80%; opacity: 1; background-color: #fff; box-shadow: 0 0 10px #fff; } /* 판정선 도달 시점 (반짝임) */
  85% { top: 90%; opacity: 0; }
  100% { top: 100%; opacity: 0; }
`;

// 2. 키가 눌리는 효과 (노트 타이밍에 맞춰)
const keyPressBeat = keyframes`
  0%, 70% { transform: translateY(0); box-shadow: 0 4px 0 #444; color: #ccc; border-color: #666; background: #222; }
  75% { transform: translateY(4px); box-shadow: 0 0 0 #444; color: ${MAIN_CYAN}; border-color: ${MAIN_CYAN}; background: rgba(96, 255, 255, 0.2); } /* 눌림 */
  85%, 100% { transform: translateY(0); box-shadow: 0 4px 0 #444; color: #ccc; border-color: #666; background: #222; }
`;

// 3. 판정선 반짝임
const lineFlash = keyframes`
  0%, 74% { opacity: 0.5; background-color: rgba(0, 191, 255, 0.5); }
  75% { opacity: 1; background-color: #fff; box-shadow: 0 0 20px #fff; }
  76%, 100% { opacity: 0.5; background-color: rgba(0, 191, 255, 0.5); }
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
  z-index: 2000; /* 기존 모달보다 높게 */
`;

const ModalBox = styled.div`
  position: relative;
  width: 90%;
  max-width: 600px;
  background: rgba(0, 10, 20, 0.95);
  padding: 2rem;
  font-family: "Galmuri11", sans-serif;
  color: #fff;
  
  /* 네온 테두리 */
  box-shadow:
    -4px 0 0 0 ${MAIN_CYAN},
    4px 0 0 0 ${MAIN_CYAN},
    0 -4px 0 0 ${MAIN_CYAN},
    0 4px 0 0 ${MAIN_CYAN},
    0 0 20px ${NEON_BLUE};

  &::after {
    content: "";
    position: absolute;
    top: -4px; left: -4px; right: -4px; bottom: -4px;
    box-shadow: -4px 0 0 0 ${MAIN_CYAN}, 4px 0 0 0 ${MAIN_CYAN}, 0 -4px 0 0 ${MAIN_CYAN}, 0 4px 0 0 ${MAIN_CYAN};
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

// --- 시뮬레이션 화면 ---
const DemoStage = styled.div`
  width: 100%;
  height: 200px;
  background: #111;
  border: 2px solid #333;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  
  /* 배경 그리드 (레인 구분선) */
  background-image: linear-gradient(90deg, transparent 97%, #222 97%);
  background-size: 25% 100%;
`;

// 판정선
const HitLine = styled.div`
  position: absolute;
  top: 80%;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(0, 191, 255, 0.7);
  box-shadow: 0 0 10px rgba(0, 191, 255, 0.8);
  animation: ${lineFlash} 2s infinite; /* 2초마다 반짝 */
`;

// 떨어지는 데모 노트
const DemoNote = styled.div<{ $lane: number; $delay: string }>`
  position: absolute;
  top: -20%;
  left: ${(props) => props.$lane * 25}%;
  width: 25%;
  height: 20px;
  
  /* 노트 디자인 */
  &::before {
    content: "";
    display: block;
    width: 80%;
    height: 100%;
    margin: 0 auto;
    background: ${MAIN_CYAN};
    border: 2px solid #fff;
    box-shadow: 0 0 5px ${MAIN_CYAN};
    border-radius: 4px;
  }

  animation: ${noteFall} 2s infinite linear;
  animation-delay: ${(props) => props.$delay};
`;

// --- 조작키 설명 ---
const KeyContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  padding: 0 10%;
`;

const KeyCap = styled.div<{ $delay: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  
  /* 키캡 모양 */
  .cap {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: monospace;
    font-size: 1.5rem;
    font-weight: bold;
    color: #ccc;
    background: #222;
    border: 2px solid #666;
    border-radius: 8px;
    border-bottom-width: 6px;
    
    /* 비트 애니메이션 */
    animation: ${keyPressBeat} 2s infinite;
    animation-delay: ${(props) => props.$delay};
  }

  .label {
    font-size: 0.8rem;
    color: #888;
  }
`;

const Description = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #ddd;
  text-align: center;
  
  p { margin: 0 auto; letter-spacing: 0.05em; }

  .typing-effect {
    animation: ${typing} 3s steps(30, end), ${blink} 0.75s step-end infinite;
    border-right: 3px solid ${MAIN_CYAN};
    width: 100%;
    max-width: fit-content;
    white-space: nowrap;
    overflow: hidden;
    margin: 0 auto 10px;
    font-size: 1.1rem;
    color: ${MAIN_CYAN};
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

interface Props {
  onClose: () => void;
}

export default function RhythmHelpModal({ onClose }: Props) {
  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <Header>HOW TO PLAY</Header>

        {/* 1. 시뮬레이션 스테이지 */}
        <DemoStage>
          {/* 가이드라인 */}
          <HitLine />
          
          {/* 떨어지는 데모 노트들 (D, F, J, K 순서로 시간차 낙하) */}
          <DemoNote $lane={0} $delay="0s" />  {/* D */}
          <DemoNote $lane={1} $delay="0.5s" /> {/* F */}
          <DemoNote $lane={2} $delay="1.0s" /> {/* J */}
          <DemoNote $lane={3} $delay="1.5s" /> {/* K */}
        </DemoStage>

        {/* 2. 조작키 */}
        <KeyContainer>
          <KeyCap $delay="0s">
            <div className="cap">D</div>
            <span className="label">LANE 1</span>
          </KeyCap>
          <KeyCap $delay="0.5s">
            <div className="cap">F</div>
            <span className="label">LANE 2</span>
          </KeyCap>
          <KeyCap $delay="1.0s">
            <div className="cap">J</div>
            <span className="label">LANE 3</span>
          </KeyCap>
          <KeyCap $delay="1.5s">
            <div className="cap">K</div>
            <span className="label">LANE 4</span>
          </KeyCap>
        </KeyContainer>

        {/* 3. 설명 */}
        <Description>
          <p className="typing-effect">음악에 맞춰 노트를 정확히 입력하세요.</p>
          <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
            <span style={{color: HIT_PINK}}>판정선(Blue Line)</span>에 닿을 때 키를 누르십시오.
            <br />
            연속 콤보 시 고득점을 획득합니다.
          </p>
        </Description>

        <CloseButton onClick={onClose}>CLOSE</CloseButton>
      </ModalBox>
    </Overlay>
  );
}