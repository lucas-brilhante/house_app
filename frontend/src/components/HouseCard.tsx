import React from "react";
import styled from "styled-components";

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
  house: House;
}

const HouseCard: React.FC<Props> = ({ house }) => {
  return (
    <Container>
      <Header>
        <Thumbnail>
          <Image src={house.HouseImages[0].imageUrl} alt="Thumb" />
        </Thumbnail>
        <TitleGroup>
          <Title>{house.address + ","}</Title>
          <Title>{house.number}</Title>
        </TitleGroup>
      </Header>
      <InfoGroup>
        <TextInfo>Valor:</TextInfo>
        <TextInfo>R$ 399,99</TextInfo>
      </InfoGroup>
      <InfoGroup>
        <TextInfo>Telefone:</TextInfo>
        <TextInfo>(85)9 8814-0116</TextInfo>
      </InfoGroup>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 120px;
  background-color: beige;
  margin: 16px;
  padding: 8px;

  &:hover {
    border: 1px solid black;
    cursor: pointer;
  }

  &:active {
    padding: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Thumbnail = styled.div`
  display: flex;
  width: 48px;
  height: 48px;
  background-color: chocolate;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 16px;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: row;
`;

const TextInfo = styled.span`
  font-size: 14px;
  padding: 4px;
`;

export default HouseCard;
