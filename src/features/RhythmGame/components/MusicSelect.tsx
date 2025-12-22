import styled, { css, keyframes } from "styled-components";
import type { Music } from "../types/music";
// 배경 이미지는 기존 GameIntro와 동일한 경로로 설정해주세요
import BackGround from "../assets/image/serverBack.png"; 
import { useState } from "react";
import RhythmHelpModal from "./HelpModal";

type Props = {
  musics: Music[];
  onSelect: (music: Music) => void;
  onGoHome: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
};

// --- Animations & Styles (GameIntro와 동일) ---

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
  0% { box-shadow: -4px 0 0 0 #4DEEEA, 4px 0 0 0 #4DEEEA, 0 -4px 0 0 #4DEEEA, 0 4px 0 0 #4DEEEA, 0 0 10px 0 rgba(0, 85, 255, 0.7); }
  50% { box-shadow: -4px 0 0 0 #4DEEEA, 4px 0 0 0 #4DEEEA, 0 -4px 0 0 #4DEEEA, 0 4px 0 0 #4DEEEA, 0 0 40px 10px rgba(0, 85, 255, 0.9); }
  100% { box-shadow: -4px 0 0 0 #4DEEEA, 4px 0 0 0 #4DEEEA, 0 -4px 0 0 #4DEEEA, 0 4px 0 0 #4DEEEA, 0 0 10px 0 rgba(0, 85, 255, 0.7); }
`;

const pixelBorderNeon = css`
  position: relative;
  background: rgba(0, 10, 20, 0.8);
  margin: 4px;
  animation: ${borderPulse} 3s infinite ease-in-out;

  &::after {
    content: "";
    position: absolute;
    top: -4px; left: -4px; right: -4px; bottom: -4px;
    box-shadow: -4px 0 0 0 #4deeea, 4px 0 0 0 #4deeea, 0 -4px 0 0 #4deeea, 0 4px 0 0 #4deeea;
    z-index: -1;
  }
`;

// --- Styled Components ---

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
  gap: 1.5rem;
  max-height: 95vh;
  width: 100%;
  max-width: 800px; /* 음악 목록이 길어질 수 있어 폭을 넓힘 */
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
    font-size: 3.5rem;
    margin-top: 0.5rem;
    color: #FF6B6B; /* 리듬 게임 포인트 컬러 */
  }
  
  .note {
    font-size: 2.5rem;
    vertical-align: middle;
  }
`;

// 공통 박스 스타일
const NeonBox = styled.div`
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

// 배속 버튼 래퍼
const SpeedButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;

// 음악 목록 (스크롤 가능하게 수정)
const MusicList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 40vh; /* 목록이 길면 스크롤 */
  overflow-y: auto;
  
  /* 스크롤바 커스텀 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #4DEEEA;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const MusicItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 10px;
  font-size: 1.1rem;
  border-bottom: 1px solid rgba(77, 238, 234, 0.2);
  cursor: pointer;
  transition: all 0.2s;

  &:last-child {
    border: none;
  }

  &:hover {
    background: rgba(77, 238, 234, 0.2);
    transform: translateX(5px);
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .title {
    color: #FFD700;
    font-size: 1.2rem;
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }

  .artist {
    color: #fff;
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .meta {
    text-align: right;
    font-size: 0.8rem;
    color: #4DEEEA;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  width: 100%;
  justify-content: center;
  margin-top: 10px;
`;

// 버튼 스타일 (primary: 빨강, 기본: 청록)
const PixelButton = styled.button<{ $primary?: boolean; $active?: boolean }>`
  font-family: "Galmuri11", sans-serif;
  font-size: 1.1rem;
  
  /* Active 상태이거나 Primary일 때 색상 변경 */
  background: ${(props) =>
    props.$active || props.$primary 
      ? "rgba(255, 107, 107, 0.2)" 
      : "rgba(77, 238, 234, 0.1)"};
      
  color: ${(props) => (props.$active || props.$primary ? "#FF6B6B" : "#4DEEEA")};
  
  border: 2px solid ${(props) => (props.$active || props.$primary ? "#FF6B6B" : "#4DEEEA")};
  
  padding: 10px 20px;
  cursor: pointer;
  position: relative;

  box-shadow: inset 0 0 10px ${(props) =>
    props.$active || props.$primary
      ? "rgba(255, 107, 107, 0.3)"
      : "rgba(77, 238, 234, 0.3)"},
    0 0 10px rgba(0, 0, 0, 0.5);
    
  text-shadow: 0 0 5px ${(props) =>
    props.$active || props.$primary ? "rgba(255, 107, 107, 0.5)" : "rgba(77, 238, 234, 0.5)"};

  transition: all 0.1s;

  &:hover {
    transform: translate(-2px, -2px);
    background: ${(props) => (props.$active || props.$primary ? "#FF6B6B" : "#4DEEEA")};
    color: #000;
    text-shadow: none;
    box-shadow: 0 0 20px ${(props) => (props.$active || props.$primary ? "#FF6B6B" : "#4DEEEA")},
      4px 4px 0px 0px #000;
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: none;
  }
`;

// --- Main Component ---

export default function MusicSelect({
  musics,
  onSelect,
  onGoHome,
  speed,
  onSpeedChange,
}: Props) {
  const speedOptions = [1.0, 1.5, 2.0, 3.0, 4.0];

  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <Container>
      <ContentWrapper>
        {/* 타이틀 영역 */}
        <TitleSection>
          <MainTitle>
            RHYTHM CODE
            <span className="note">🎵</span>
            <br />
            <span className="highlight">MUSIC SELECT</span>
          </MainTitle>
        </TitleSection>

        {/* 1. 배속 설정 박스 */}
        <NeonBox>
          <BoxHeader>NOTE SPEED SETTING</BoxHeader>
          <SpeedButtonContainer>
            {speedOptions.map((option) => (
              <PixelButton
                key={option}
                onClick={() => onSpeedChange(option)}
                $active={speed === option} // 선택된 배속 강조
              >
                {option}x
              </PixelButton>
            ))}
          </SpeedButtonContainer>
        </NeonBox>

        {/* 2. 음악 목록 박스 */}
        <NeonBox style={{ flex: 1 }}>
          <BoxHeader>TRACK LIST</BoxHeader>
          {musics.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
              NO MUSIC DATA FOUND...
            </div>
          ) : (
            <MusicList>
              {musics.map((music) => (
                <MusicItem key={music.id} onClick={() => onSelect(music)}>
                  <div className="info">
                    <span className="title">{music.title}</span>
                    <span className="artist">{music.artist || "Unknown Artist"}</span>
                  </div>
                  <div className="meta">
                    <div>NOTES: {music.notes.length}</div>
                    {music.bpm && <div>BPM: {music.bpm}</div>}
                  </div>
                </MusicItem>
              ))}
            </MusicList>
          )}
        </NeonBox>

        {/* 버튼 그룹 */}
        <ButtonGroup>
          {/* 4. 도움말 버튼 추가 */}
          <PixelButton onClick={() => setIsHelpOpen(true)}>
            SYSTEM HELP
          </PixelButton>

          <PixelButton $primary onClick={onGoHome}>
            EXIT TO HOME
          </PixelButton>
        </ButtonGroup>
        
        {/* 5. 모달 렌더링 */}
        {isHelpOpen && <RhythmHelpModal onClose={() => setIsHelpOpen(false)} />}
      </ContentWrapper>
    </Container>
  );
}