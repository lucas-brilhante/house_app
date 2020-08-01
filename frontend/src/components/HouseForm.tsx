import React, { useReducer, useCallback } from "react";
import styled from "styled-components";
import Dropzone from "./Dropzone";
import api from "../service/api";

// Reducer

interface photoStatus {
  id: number;
  imageUrl: string;
  HouseId: number;
  status: string;
}

type FormState = {
  address: string;
  number: string;
  newPhotos: File[];
  isEditing: boolean;

  photosStatus?: photoStatus[];
  photos?: File[];
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
  payload: { newPhotos: File; index: number };
};

type SetIsEditing = {
  type: "SET_ISEDIT";
  payload: FormState;
};

type SetExistentPhotoStatus = {
  type: "SET_PHOTO_STATUS";
  payload: {
    status: string;
    index: number;
    photo: File;
  };
};

type DeleteNewPhoto = {
  type: "DELETE_NEW_PHOTO";
  payload: number;
};

type DeletePhoto = {
  type: "DELETE_PHOTO";
  payload: number;
};

type Action =
  | SetFieldAction
  | AddPhotosAction
  | UpdatePhotosAction
  | SetIsEditing
  | SetExistentPhotoStatus
  | DeleteNewPhoto
  | DeletePhoto;

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
  newPhotos: [],
  isEditing: false,
};

const formReducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case "SET_FIELD": {
      const fieldName = action.payload.fieldName;
      const value = action.payload.value;
      return { ...state, [fieldName]: value };
    }
    case "ADD_PHOTO":
      return { ...state, newPhotos: state.newPhotos.concat(action.payload) };
    case "UPDATE_PHOTO": {
      let newPhotos = state.newPhotos.slice();
      newPhotos[action.payload.index] = action.payload.newPhotos;
      return { ...state, newPhotos };
    }
    case "SET_ISEDIT":
      return { ...action.payload };
    case "SET_PHOTO_STATUS": {
      let photosStatus = state.photosStatus?.slice();
      let photos = state.photos?.slice();
      if (photosStatus)
        photosStatus[action.payload.index].status = action.payload.status;
      if (photos) {
        photos[action.payload.index] = action.payload.photo;
      }
      return { ...state, photosStatus, photos };
    }
    case "DELETE_NEW_PHOTO": {
      let newPhotos = state.newPhotos.filter(
        (_, index) => index !== action.payload
      );
      return { ...state, newPhotos };
    }
    case "DELETE_PHOTO": {
      let photosStatus = state.photosStatus?.slice();
      if (photosStatus) photosStatus[action.payload].status = "DELETED";
      return { ...state, photosStatus };
    }
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

  const addNewPhoto = useCallback((photo: File) => {
    dispatch({
      type: "ADD_PHOTO",
      payload: photo,
    });
  }, []);

  const updateNewPhoto = useCallback((newPhotos: File, index: number) => {
    dispatch({
      type: "UPDATE_PHOTO",
      payload: { newPhotos, index },
    });
  }, []);

  const updateExistentPhoto = useCallback((photo: File, index: number) => {
    dispatch({
      type: "SET_PHOTO_STATUS",
      payload: {
        index,
        photo,
        status: "CHANGED",
      },
    });
  }, []);

  const deleteNewPhoto = useCallback((index: number) => {
    dispatch({ type: "DELETE_NEW_PHOTO", payload: index });
  }, []);

  const deletePhoto = useCallback((index: number) => {
    dispatch({ type: "DELETE_PHOTO", payload: index });
  }, []);

  const handleEditMode = () => {
    if (!formInfo) return;
    const newFormFields = {
      address: formInfo.address,
      number: formInfo.number,
      isEditing: true,
      newPhotos: [],
      photos: [],
      photosStatus: formInfo.HouseImages.map((photos) => ({
        ...photos,
        status: "UNCHANGED",
      })),
    };
    dispatch({ type: "SET_ISEDIT", payload: newFormFields });
  };

  const addHouse = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append("address", form.address);
      formData.append("number", form.number);
      form.newPhotos.forEach((photo) => {
        formData.append("newPhotos", photo);
      });
      await api.post("/houses", formData);
      closeForm();
    },
    [form, closeForm]
  );

  const editHouse = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const updatedHouse = {
        id: formInfo?.id,
        address: form.address,
        number: form.number,
        photosStatus: form.photosStatus?.map((photo) => ({
          id: photo.id,
          imageUrl: photo.imageUrl,
          HouseId: photo.HouseId,
          status: photo.status,
        })),
      };

      const parsedUpdatedHouse = JSON.stringify(updatedHouse);

      const formData = new FormData();

      formData.append("data", parsedUpdatedHouse);

      form.newPhotos.forEach((newPhoto) => {
        formData.append("newPhotos", newPhoto);
      });

      form.photos?.forEach((photo) => {
        formData.append("photos", photo);
      });

      await api.put(`houses/${formInfo?.id}`, formData);
      closeForm();
      console.log("HOUSE EDITED");
    },
    [
      closeForm,
      form.address,
      form.newPhotos,
      form.number,
      form.photosStatus,
      form.photos,
      formInfo,
    ]
  );

  const deleteHouse = async () => {
    const response = await api.delete(`houses/${formInfo?.id}`);
    closeForm();
    console.log("HOUSE DELETED", response);
  };

  // JSX
  if (!formInfo)
    // REGISTER HOUSE
    return (
      <Form onSubmit={addHouse}>
        <Title>Cadastro de Casa</Title>
        <ImagensGroup>
          {form.newPhotos.map((photo, i) => {
            const path = URL.createObjectURL(photo);
            return (
              <Dropzone
                key={path}
                photo={path}
                updatePhoto={updateNewPhoto}
                deleteNewPhoto={deleteNewPhoto}
                index={i}
              />
            );
          })}
          <Dropzone addPhoto={addNewPhoto} />
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
  // EDIT HOUSE
  if (form.isEditing)
    return (
      <Form onSubmit={editHouse}>
        <Title>Editar Casa</Title>
        <ImagensGroup>
          {form.photosStatus &&
            form.photosStatus.map((image, i) => {
              if (image.status !== "DELETED") {
                let photo = null;

                if (form.photos) photo = form.photos[i];

                const path = photo ? URL.createObjectURL(photo) : undefined;
                return (
                  <Dropzone
                    key={image.id}
                    photo={path}
                    imageUrl={image.imageUrl}
                    updateExistentPhoto={updateExistentPhoto}
                    deletePhoto={deletePhoto}
                    index={i}
                  />
                );
              } else return null;
            })}
          {form.newPhotos.map((photo, i) => {
            const path = URL.createObjectURL(photo);
            return (
              <Dropzone
                key={path}
                photo={path}
                updatePhoto={updateNewPhoto}
                deleteNewPhoto={deleteNewPhoto}
                index={i}
              />
            );
          })}
          <Dropzone addPhoto={addNewPhoto} />
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
  width: 100%;
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
  margin: 8px;
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
