import React from "react";
import styled from "styled-components";

interface Props {
  handleForm: () => void;
}

const Header: React.FC<Props> = ({ handleForm }) => {
  return (
    <Container>
      <Content>
        <Title>Houses App</Title>
        <AddButton onClick={handleForm}>Cadastrar Casa</AddButton>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 48px;
  background-color: aqua;
  padding: 16px;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  background-color: white;
  align-items: center;
`;

const Title = styled.span`
  font-size: 16px;
  margin-right: auto;
`;

const AddButton = styled.button`
  height: 40px;
  width: 100px;
`;

export default Header;
