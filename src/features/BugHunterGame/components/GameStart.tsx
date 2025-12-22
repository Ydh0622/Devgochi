import { useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import BackGround from "../images/serverBack.png";
import GameHelpModal from "./HelpModal";

// Props 타입 정의
interface GameStartProps {
  onStart: () => void;
}

interface GameRecord {
  score: number;
  date: string;
}

// --- Animation & Keyframes (GameIntro와 동일) ---

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
      0 0 40px 10px rgba(0, 85, 255, 0.9);
  }
  100% { 
    box-shadow: 
      -4px 0 0 0 #4DEEEA, 4px 0 0 0 #4DEEEA, 
      0 -4px 0 0 #4DEEEA, 0 4px 0 0 #4DEEEA,
      0 0 10px 0 rgba(0, 85, 255, 0.7); 
  }
`;

// --- Styles (GameIntro와 동일한 디자인 시스템) ---

const pixelBorderNeon = css`
  position: relative;
  background: rgba(0, 10, 20, 0.8); /* 가독성을 위해 배경을 조금 더 진하게 */
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

const Container = styled.div`
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
  font-family: "Galmuri11", sans-serif;
  color: white;
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5); /* 배경 딤 처리 강화 */
    z-index: 0;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-height: 95vh;
  width: 100%;
  max-width: 600px;
`;

const TitleSection = styled.div`
  text-align: center;
  margin-bottom: 10px;
`;

const MainTitle = styled.h1`
  font-size: 3rem;
  margin: 0;
  line-height: 1.2;
  color: #f0ffff;
  animation: ${textFlicker} 4s infinite;

  .highlight {
    display: block;
    font-size: 2rem;
    color: #4deeea;
    margin-top: 0.5rem;
    letter-spacing: 5px;
  }
`;

// 박스 스타일 공통
const InfoBox = styled.div`
  width: 100%;
  padding: 1.5rem;
  box-sizing: border-box;
  ${pixelBorderNeon}
`;

const BoxHeader = styled.div`
  border-bottom: 2px dashed #4deeea;
  padding-bottom: 10px;
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: #4deeea;
  text-align: center;
  text-shadow: 0 0 10px rgba(77, 238, 234, 0.5);
`;

const ListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 1rem;
  border-bottom: 1px solid rgba(77, 238, 234, 0.2);

  &:last-child {
    border: none;
  }

  span {
    display: inline-block;
  }

  /* 랭킹 스타일 */
  .rank {
    color: #ffd700;
    width: 80px;
  }
  .score {
    text-align: right;
    flex: 1;
    margin-right: 15px;
  }
  .date {
    color: #888;
    font-size: 0.8rem;
  }

  /* 조작법 스타일 */
  .key {
    color: #ff6b6b;
    font-weight: bold;
  }
  .action {
    color: #fff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  width: 100%;
  justify-content: center;
  margin-top: 10px;
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

// --- Component ---

const GameStart = ({ onStart }: GameStartProps) => {
  // 초기값은 빈 배열
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    // 1. 로컬 스토리지에서 데이터 가져오기
    const savedRecordsJSON = localStorage.getItem("bugHunterRecords");

    if (savedRecordsJSON) {
      // 2. 데이터가 있으면 파싱해서 상태에 저장
      try {
        const parsedRecords = JSON.parse(savedRecordsJSON);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecords(parsedRecords);
      } catch (e) {
        console.error("랭킹 파싱 에러", e);
        setRecords([]);
      }
    } else {
      // 3. 데이터가 아예 없는 경우 (처음 실행 시)
      // 빈 배열로 두거나, 원하시면 여기서 '기본 더미 데이터'를 로컬스토리지에 넣어줄 수도 있습니다.
      // 일단은 깔끔하게 빈 상태로 둡니다.
      setRecords([]);
    }
  }, []);

  return (
    <Container>
      <ContentWrapper>
        {/* 타이틀 영역 */}
        <TitleSection>
          <MainTitle>Bug Hunter</MainTitle>
        </TitleSection>

        {/* 1. 랭킹 보드*/}
        <InfoBox>
          <BoxHeader>SYSTEM_RECORDS_TOP_5</BoxHeader>
          <ListContainer>
            {records.map((record, index) => (
              <ListItem key={index}>
                <span className="rank">RANK 0{index + 1}</span>
                <span className="score">
                  {record.score.toLocaleString()} PTS
                </span>
                <span className="date">[{record.date}]</span>
              </ListItem>
            ))}
          </ListContainer>
        </InfoBox>

        {/* 버튼 영역 */}
        <ButtonGroup>
          {/* [추가] 도움말 버튼 */}
          <PixelButton onClick={() => setIsHelpOpen(true)}>
            SYSTEM HELP
          </PixelButton>

          <PixelButton $primary onClick={onStart}>
            MISSION START
          </PixelButton>
        </ButtonGroup>

        {/* [추가] 모달 렌더링 */}
        {isHelpOpen && <GameHelpModal onClose={() => setIsHelpOpen(false)} />}
      </ContentWrapper>
    </Container>
  );
};

export default GameStart;
