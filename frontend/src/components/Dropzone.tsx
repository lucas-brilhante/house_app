import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

interface Props {
  addPhoto?: (photo: File) => void;
  updatePhoto?: (photo: File, index: number) => void;
  updateExistentPhoto?: (photo: File, index: number) => void;
  deleteNewPhoto?: (index: number) => void;
  deletePhoto?: (index: number) => void;
  photo?: string;
  index?: number;
  imageUrl?: string;
}

const Dropzone: React.FC<Props> = ({
  addPhoto,
  photo,
  index,
  updatePhoto,
  imageUrl,
  updateExistentPhoto,
  deleteNewPhoto,
  deletePhoto,
}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!photo && !imageUrl && addPhoto) {
        addPhoto(acceptedFiles);
        return;
      }

      const i = index ? index : 0;

      if (imageUrl) {
        if (updateExistentPhoto) updateExistentPhoto(acceptedFiles[0], i);
      } else if (updatePhoto) {
        updatePhoto(acceptedFiles[0], i);
      }
    },
    [addPhoto, updatePhoto, photo, index, imageUrl, updateExistentPhoto]
  );

  const deleteFormPhoto = () => {
    const i = index ? index : 0;
    if (imageUrl) {
      if (deletePhoto) deletePhoto(i);
    } else if (deleteNewPhoto) deleteNewPhoto(i);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <Container>
      {(photo || imageUrl) && (
        <ButtonContainer>
          <CloseButton onClick={deleteFormPhoto} type="button">
            X
          </CloseButton>
        </ButtonContainer>
      )}
      <Content {...getRootProps()}>
        <input {...getInputProps()} />
        {photo && <Image src={photo} alt=" " />}
        {imageUrl && !photo && <Image src={imageUrl} alt=" " />}
        {!photo && !imageUrl && <p>+</p>}
      </Content>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  width: 96px;
  height: 96px;
  background: blue;
  margin: 8px;
  margin-top: 12px;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;
const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  justify-content: flex-end;
  align-items: flex-start;
`;
const CloseButton = styled.button`
  width: 19px;
  height: 19px;
  font-size: 11px;
  border-radius: 50%;
  border: 0;
  margin-right: -9px;
  margin-top: -9px;
  cursor: pointer;
  outline: none;
  z-index: 2;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

export default Dropzone;
