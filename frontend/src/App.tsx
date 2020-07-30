import React, { useState } from "react";
import styled from "styled-components";
import HouseForm from "./components/HouseForm";
import Header from "./components/Header";
import HousesGrid from "./components/HousesGrid";

function App() {
  const [houseForm, toogleHouseForm] = useState(false);

  const handleForm = () => {
    toogleHouseForm((state) => !state);
  };

  return (
    <Container>
      <Header handleForm={handleForm} />
      <Body>
        {houseForm && <HouseForm />}
        <HousesGrid />
      </Body>
    </Container>
  );
}

const Container = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #ddd;
  height: 100vh;
`;

const Body = styled.div`
  display: flex;
  padding: 16px 32px;
  justify-content: space-between;
`;

export default App;
