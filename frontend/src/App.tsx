import React from "react";
import styled from "styled-components";
import HouseForm from "./components/HouseForm";

function App() {
  return (
    <Container>
      <HouseForm />
    </Container>
  );
}

const Container = styled.main`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #ddd;
`;

export default App;
