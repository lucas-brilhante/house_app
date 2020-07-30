import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

interface Props {
  addPhoto: (photo: File) => void;
  updatePhoto: (photo: File, index: number) => void;
  photo?: File;
  index?: number;
}

const Dropzone: React.FC<Props> = ({ addPhoto, photo, index, updatePhoto }) => {
  const url = photo ? URL.createObjectURL(photo) : "";
  const [file, setFile] = useState(url);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (photo === undefined) {
        addPhoto(acceptedFiles);
      } else {
        const i = index ? index : 0;
        const fileurl = URL.createObjectURL(acceptedFiles[0]);
        setFile(fileurl);
        updatePhoto(acceptedFiles[0], i);
      }
    },
    [addPhoto, updatePhoto, photo, index]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <Container {...getRootProps()}>
      <input {...getInputProps()} />
      {file ? <Image src={file} alt=" " /> : <p>+</p>}
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
