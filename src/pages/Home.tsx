import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 60px;
`;

const Title = styled.div`
  font-size: 1.5em;
  text-align: center;
  color: #bf4f74;
`;

function Home() {
  return (
    <Container>
      <Title>This is home</Title>
    </Container>
  );
}

export default Home;
