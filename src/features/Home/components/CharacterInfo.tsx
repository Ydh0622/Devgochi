import styled from "styled-components";
import { getLocalStorage } from "@/shared/localStorage";
import { EXP_LIMITS } from "@/hooks/utils/hookUtils";

/** ✅ 픽셀 룩 공통 토큰 */
const PX = 2;

const WindowContainer = styled.div`
  margin: 20px;
  width: 360px;
  background: #c6c6c6;
  padding: ${PX * 2}px;
  border-top: ${PX}px solid #ffffff;
  border-left: ${PX}px solid #ffffff;
  border-right: ${PX}px solid #747171ff;
  border-bottom: ${PX}px solid #747171ff;
  box-shadow: ${PX * 2}px ${PX * 2}px 0 #000;
  image-rendering: pixelated;
  font-family: "Courier New", Courier, monospace;
`;

const TitleBar = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${PX * 4}px;
  background: #0b2a7a;
  color: #fff;
  box-shadow: inset 0 ${PX}px 0 rgba(255, 255, 255, 0.25);
`;

const TitleText = styled.div`
  font-size: 12px;
  letter-spacing: 0.5px;
`;

const TitleButtons = styled.div`
  display: flex;
  gap: ${PX * 2}px;
`;

const WinBtn = styled.button`
  width: 18px;
  height: 18px;
  padding: 0;
  background: #c6c6c6;
  box-shadow: inset ${PX}px ${PX}px 0 #fff;
  cursor: pointer;
  position: relative;

  &:active {
    box-shadow: inset ${PX}px ${PX}px 0 #7a7a7a;
    transform: translate(${PX}px, ${PX}px);
  }
`;

const Content = styled.div`
  padding: 16px;
  background: #bdbdbd;
  margin-top: ${PX * 2}px;

  /* CRT/스캔라인 느낌 (원하면 제거 가능) */
  background-image: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.05) 0px,
    rgba(0, 0, 0, 0.05) 1px,
    transparent 1px,
    transparent 3px
  );
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const PixelIconBox = styled.div`
  width: 54px;
  height: 54px;
  background: #9aa9b1;
  box-shadow: inset ${PX}px ${PX}px 0 rgba(255, 255, 255, 0.35);
  display: grid;
  place-items: center;
  font-size: 26px;
`;

const LevelText = styled.div`
  font-size: 14px;
  color: #111;
  line-height: 1.2;
`;

const ExpSection = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ExpRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
`;

const ExpLabel = styled.div`
  font-size: 12px;
  color: #111;
`;

const PercentText = styled.div`
  font-size: 12px;
  color: #111;
`;

/** ✅ 블록형(도트) 게이지 */
const ProgressBarTrack = styled.div`
  height: 20px;
  background: #e9e9e9;
  box-shadow: inset ${PX}px ${PX}px 0 #fff;
  padding: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(p) => p.$percent}%;
  /* ‘블록’ 느낌: 작은 사각 타일이 반복되게 */
  background-image: repeating-linear-gradient(
    90deg,
    #27d24a 0px,
    #27d24a 10px,
    #1ea33a 10px,
    #1ea33a 12px
  );
  /* 픽셀 느낌을 위해 경계 더 딱딱하게 */
  box-shadow: inset 0 ${PX}px 0 rgba(255, 255, 255, 0.35);
`;

const FooterIcons = styled.div`
  margin-top: 14px;
  display: flex;
  gap: 12px;
  align-items: center;
`;

const SmallIcon = styled.div`
  width: 26px;
  height: 26px;
  background: #c6c6c6;
  border-top: ${PX}px solid #ffffff;
  border-left: ${PX}px solid #ffffff;
  border-right: ${PX}px solid #747171ff;
  border-bottom: ${PX}px solid #747171ff;
  display: grid;
  place-items: center;
  font-size: 14px;
`;

const CharacterInfo = () => {
  const level = getLocalStorage("level");
  const exp = getLocalStorage("exp");

  const maxExp = EXP_LIMITS[level] || 1000;
  const percent = Math.min(Math.round((exp / maxExp) * 100), 100);

  return (
    <WindowContainer>
      <TitleBar>
        <TitleText>MY COMPUTER INFO</TitleText>
        <TitleButtons>
          <WinBtn aria-label="minimize" />
          <WinBtn aria-label="maximize" />
          <WinBtn aria-label="close" />
        </TitleButtons>
      </TitleBar>

      <Content>
        <InfoRow>
          <PixelIconBox>💻</PixelIconBox>
          <LevelText>LV.{String(level).padStart(2, "0")} PIXEL</LevelText>
        </InfoRow>

        <ExpSection>
          <ExpRow>
            <ExpLabel>XP BAR:</ExpLabel>
            <ProgressBarTrack>
              <ProgressFill $percent={percent} />
            </ProgressBarTrack>
            <PercentText>{percent}%</PercentText>
          </ExpRow>
        </ExpSection>

        <FooterIcons>
          <SmallIcon>🍗</SmallIcon>
          <SmallIcon>🧪</SmallIcon>
          <SmallIcon>⚡</SmallIcon>
        </FooterIcons>
      </Content>
    </WindowContainer>
  );
};

export default CharacterInfo;
