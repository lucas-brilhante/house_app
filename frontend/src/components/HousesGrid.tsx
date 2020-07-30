import React, { useState, useEffect } from "react";
import styled from "styled-components";
import HouseCard from "./HouseCard";
import api from "../service/api";

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

interface Props {
  ViewInfo: (houseInfo: House) => void;
}

const HousesGrid: React.FC<Props> = ({ ViewInfo }) => {
  const [houses, setHouses] = useState<House[]>([]);

  useEffect(() => {
    const fetchHouses = async () => {
      const response = await api.get("http://localhost:3333/houses");
      setHouses(response.data);
    };
    fetchHouses();
  }, []);

  return (
    <Container>
      {houses.map((house) => (
        <HouseCard key={house.id} ViewInfo={ViewInfo} house={house} />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-content: flex-start;
  background-color: burlywood;
  height: calc(100vh - 120px);
  overflow-y: auto;
`;

export default HousesGrid;
