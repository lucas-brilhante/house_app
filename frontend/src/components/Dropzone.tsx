import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

interface Props {
  addPhoto: (photo: File) => void;
  updatePhoto: (photo: File, index: number) => void;
  updateExistentPhoto?: (photo: File, index: number) => void;
  photo?: File;
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
}) => {
  const path = photo ? URL.createObjectURL(photo) : "";
  const [file, setFile] = useState(path);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!photo && !imageUrl) {
        addPhoto(acceptedFiles);
        return;
      }

      const i = index ? index : 0;
      const fileurl = URL.createObjectURL(acceptedFiles[0]);
      setFile(fileurl);

      if (imageUrl) {
        if (updateExistentPhoto) updateExistentPhoto(acceptedFiles[0], i);
      } else {
        updatePhoto(acceptedFiles[0], i);
      }
    },
    [addPhoto, updatePhoto, photo, index, imageUrl, updateExistentPhoto]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <Container {...getRootProps()}>
      <input {...getInputProps()} />
      {file && <Image src={file} alt=" " />}
      {imageUrl && !file && <Image src={imageUrl} alt=" " />}
      {!file && !imageUrl && <p>+</p>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 96px;
  height: 96px;
  justify-content: center;
  align-items: center;
  background: blue;
  margin: 8px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

export default Dropzone;
