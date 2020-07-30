import React, { useReducer, useCallback } from "react";
import styled from "styled-components";
import Dropzone from "./Dropzone";
import api from "../service/api";

// Reducer
type FormState = {
  address: string;
  number: string;
  photos?: File[];
  isEditing: boolean;
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

type SetIsEditing = {
  type: "SET_ISEDIT";
  payload: FormState;
};

type Action =
  | SetFieldAction
  | AddPhotosAction
  | UpdatePhotosAction
  | SetIsEditing;

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

const initialState = {
  address: "",
  number: "",
  photos: [],
  isEditing: false,
};

const formReducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case "SET_FIELD":
      const fieldName = action.payload.fieldName;
      const value = action.payload.value;
      return { ...state, [fieldName]: value };
    case "ADD_PHOTO":
      return { ...state, photos: state.photos?.concat(action.payload) };
    case "UPDATE_PHOTO":
      let photos: any = state.photos?.slice();
      photos[action.payload.index] = action.payload.photo;
      return { ...state, photos };
    case "SET_ISEDIT":
      return { ...action.payload };
    default:
      return state;
  }
};

// React Component
interface Props {
  formInfo: House | null;
  closeForm: () => void;
}

const HouseForm: React.FC<Props> = ({ closeForm, formInfo }) => {
  const [form, dispatch] = useReducer(formReducer, initialState);

  // Functions
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

  const handleEditMode = () => {
    if (!formInfo) return;
    const newFormFields = {
      address: formInfo.address,
      number: formInfo.number,
      isEditing: true,
    };
    dispatch({ type: "SET_ISEDIT", payload: { ...newFormFields } });
  };

  const editHouse = async () => {
    console.log("HOUSE EDITED");
  };

  const deleteHouse = async () => {
    const response = await api.delete(`houses/${formInfo?.id}`);
    closeForm();
    console.log("HOUSE DELETED", response);
  };

  const addHouse = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append("address", form.address);
      formData.append("number", form.number);
      form.photos?.forEach((photo) => {
        formData.append("photos", photo);
      });
      await api.post("/houses", formData);
      closeForm();
    },
    [form, closeForm]
  );

  // JSX
  if (!formInfo)
    // REGISTER HOUSE
    return (
      <Form onSubmit={addHouse}>
        <Title>Cadastro de Casa</Title>
        <ImagensGroup>
          {form.photos?.map((photo, i) => (
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
        <Input name="value" />
        <Label>Telefone para contato</Label>
        <Input name="phone" />
        <Button type="submit">Cadastrar</Button>
      </Form>
    );
  if (form.isEditing)
    return (
      <Form onSubmit={editHouse}>
        <Title>Cadastro de Casa</Title>
        <ImagensGroup>
          {form.photos?.map((photo, i) => (
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
        <Input name="value" />
        <Label>Telefone para contato</Label>
        <Input name="phone" />
        <Button type="submit">Editar</Button>
      </Form>
    );
  // ELSE = VIEW HOUSE
  return (
    <Form>
      <Title>Ver Casa</Title>
      <ImagensGroup>
        {formInfo.HouseImages.map((image) => (
          <Images key={image.id}>
            <Image src={image.imageUrl} alt="image" />
          </Images>
        ))}
      </ImagensGroup>
      <Content>
        <InfoGroup>
          <Label>Endereço</Label>
          <TextInfo>{formInfo.address}</TextInfo>
          <Label>Número</Label>
          <TextInfo>{formInfo.number}</TextInfo>
          <Label>Valor</Label>
          <TextInfo>R$ 399,99</TextInfo>
          <Label>Telefone para contato</Label>
          <TextInfo>(85)9 8814-0116</TextInfo>
        </InfoGroup>
        <InfoGroup>
          <SideButtonGroup>
            <SideButton type="button" onClick={handleEditMode}>
              Editar
            </SideButton>
            <SideButton type="button" onClick={deleteHouse}>
              Deletar
            </SideButton>
          </SideButtonGroup>
        </InfoGroup>
      </Content>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  background: red;
  width: 40%;
  min-width: 300px;
  flex-direction: column;
  padding: 8px;
  height: fit-content;
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

const Button = styled.button`
  padding: 16px 24px;
  background: yellow;
`;

// Form View
const TextInfo = styled.span`
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 16px;
`;

const Images = styled.div`
  width: 96px;
  height: 96px;
  padding: 4px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const SideButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
`;

const SideButton = styled.button`
  width: 64px;
  height: 48px;
`;

export default HouseForm;
