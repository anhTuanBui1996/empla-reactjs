import React from "react";
import loadable from "@loadable/component";
import { FILESTACK } from "../../constants";
import Row from "../layout/Row";
import styled from "styled-components";
import Col from "../layout/Col";
const ReactFilestack = loadable(() => import("filestack-react"));

function ImageUploader({ handleUploadSuccessfully }) {
  return (
    <ReactFilestack
      apikey={FILESTACK.API_KEY}
      customRender={({ onPick }) => (
        <div className="dropzone dropzone-multiple dz-clickable">
          <div className="dz-default dz-message">
            <button className="dz-button" type="button" onClick={onPick}>
              Add an image
            </button>
          </div>
        </div>
      )}
      onSuccess={(res) => handleUploadSuccessfully(res)}
    />
  );
}

export const ImageReviewer = ({ data, handleUploadSuccessfully }) => {
  return (
    <ReactFilestack
      apikey={FILESTACK.API_KEY}
      customRender={({ onPick }) => (
        <div className="dz-processing dz-image-preview">
          <Row className="row align-items-center thumbnail-preview-dropzone position-relative">
            <Col columnSize={[12]}>
              <ImageBg className="image-bg">
                <ImageViewer
                  className="image-previewer avatar-img rounded w-100"
                  src={data.filesUploaded[0].url}
                  alt=""
                  onClick={onPick}
                />
                <ImageHover className="hover-blur">Change image</ImageHover>
              </ImageBg>
            </Col>
          </Row>
        </div>
      )}
      onSuccess={(res) => handleUploadSuccessfully(res)}
    />
  );
};
const ImageBg = styled.div`
  &:hover {
    .hover-blur {
      opacity: 1;
    }
    .image-previewer {
      -webkit-filter: blur(1px);
      filter: blur(1px);
      opacity: 0.6;
    }
  }
`;
const ImageViewer = styled.img`
  cursor: pointer;
  transition: 0.3s all;
`;
const ImageHover = styled.div`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3px 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s all;
`;

export default ImageUploader;
