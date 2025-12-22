import styled from "styled-components";
import { Link } from "react-router";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  margin-top: 60px;
`;

const Title = styled.div`
  font-size: 1.5em;
  text-align: center;
  color: #bf4f74;
`;

const GameButton = styled(Link)`
  padding: 15px 30px;
  border-radius: 12px;
  background-color: #238636;
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.2rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2ea043;
  }
`;

function Home() {
  return (
    <Container>
      <Title> This is home</Title>
      <GameButton to="/BugHunter">👾 버그헌터 시작하기</GameButton>
    </Container>
  );
}

export default Home;
