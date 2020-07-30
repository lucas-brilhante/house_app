import React, { useState, useCallback } from "react";
import styled from "styled-components";
import HouseForm from "./components/HouseForm";
import Header from "./components/Header";
import HousesGrid from "./components/HousesGrid";

interface HouseImages {
  id: number;
  imageUrl: string;
  HouseId: number;
}

interface House {
  id: number;
  address: string;
  number: string;
  createdAt: Date;
  updatedAt: Date;
  HouseImages: HouseImages[];
}

function App() {
  const [houseForm, toogleHouseForm] = useState(false);
  const [formInfo, setFormInfo] = useState<House | null>(null);

  const handleForm = useCallback(() => {
    if (formInfo) {
      setFormInfo(null);
    } else toogleHouseForm((state) => !state);
  }, [formInfo]);

  const closeForm = useCallback(() => {
    toogleHouseForm(false);
  }, []);

  const ViewInfo = (houseInfo: House) => {
    toogleHouseForm(true);
    setFormInfo(houseInfo);
  };

  return (
    <Container>
      <Header handleForm={handleForm} />
      <Body>
        {houseForm && <HouseForm closeForm={closeForm} formInfo={formInfo} />}
        <HousesGrid ViewInfo={ViewInfo} />
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
