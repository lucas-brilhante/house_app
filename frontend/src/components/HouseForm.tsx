import React, { useReducer, useCallback } from "react";
import styled from "styled-components";
import Dropzone from "./Dropzone";
import api from "../service/api";

type AppState = {
  address: string;
  number: string;
  value: string;
  phone: string;
  photos: File[];
};
type SetFieldAction = {
  type: "SET_FIELD";
  payload: { fieldName: string; value: string };
};

type AddPhotosAction = {
  type: "ADD_PHOTO";
  payload: File;
};

type UpdatePhotosAction = {
  type: "UPDATE_PHOTO";
  payload: { photo: File; index: number };
};

type Action = SetFieldAction | AddPhotosAction | UpdatePhotosAction;

const initialState = {
  address: "",
  number: "",
  value: "",
  phone: "",
  photos: [],
};

const formReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_FIELD":
      const fieldName = action.payload.fieldName;
      const value = action.payload.value;
      return { ...state, [fieldName]: value };
    case "ADD_PHOTO":
      return { ...state, photos: state.photos.concat(action.payload) };
    case "UPDATE_PHOTO":
      let photos = [...state.photos];
      photos[action.payload.index] = action.payload.photo;
      return { ...state, photos };
    default:
      return state;
  }
};

const HouseForm: React.FC = () => {
  const [form, dispatch] = useReducer(formReducer, initialState);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_FIELD",
      payload: { fieldName: e.target.name, value: e.target.value },
    });
  }, []);

  const addPhoto = useCallback((photo: File) => {
    dispatch({
      type: "ADD_PHOTO",
      payload: photo,
    });
  }, []);

  const updatePhoto = useCallback((photo: File, index: number) => {
    dispatch({
      type: "UPDATE_PHOTO",
      payload: { photo, index },
    });
  }, []);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append("address", form.address);
      formData.append("number", form.number);
      form.photos.forEach((photo) => {
        formData.append("photos", photo);
      });
      const response = await api.post("/houses", formData);
      console.log(response);
    },
    [form]
  );

  return (
    <Form onSubmit={onSubmit}>
      <Title>Cadastro de Casa</Title>
      <ImagensGroup>
        {form.photos.map((photo, i) => (
          <Dropzone
            key={i}
            photo={photo}
            addPhoto={addPhoto}
            updatePhoto={updatePhoto}
          />
        ))}
        <Dropzone addPhoto={addPhoto} updatePhoto={updatePhoto} />
      </ImagensGroup>
      <Label>Endereço</Label>
      <Input name="address" value={form.address} onChange={onChange} />
      <Label>Número</Label>
      <Input name="number" value={form.number} onChange={onChange} />
      <Label>Valor</Label>
      <Input name="value" value={form.value} onChange={onChange} />
      <Label>Telefone para contato</Label>
      <Input name="phone" value={form.phone} onChange={onChange} />
      <SubmitButton>Cadastrar</SubmitButton>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  background: red;
  width: 40%;
  min-width: 300px;
  flex-direction: column;
  justify-content: center;
  padding: 8px;
`;

const Title = styled.span`
  font-size: 24px;
  text-align: center;
  padding: 16px;
  padding-bottom: 0px;
`;

const ImagensGroup = styled.div`
  display: -webkit-box;
  overflow-x: auto;
  overflow-y: auto;
`;

const Label = styled.label`
  font-size: 16px;
`;

const Input = styled.input`
  background: #fff;
  width: auto;
  padding: 8px;
  margin-bottom: 16px;
  border-radius: 8px;
`;

const SubmitButton = styled.button`
  padding: 16px 24px;
  background: yellow;
`;

export default HouseForm;
