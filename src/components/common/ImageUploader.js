import React from "react";
import loadable from "@loadable/component";
import { FILESTACK } from "../../constants";
import Row from "../layout/Row";
import styled from "styled-components";
import Col from "../layout/Col";
import PropTypes from "prop-types";
import { MdClear, MdRedo } from "react-icons/md";
const ReactFilestack = loadable(() => import("filestack-react"));

function ImageUploader({
  name,
  "data-table": dataTable,
  imgData,
  imgThumbnail,
  handleUploadSuccessfully,
  handleClearImg,
}) {
  const handleRetriveImg = () => {};
  return (
    <ReactFilestack
      apikey={FILESTACK.API_KEY}
      customRender={({ onPick }) =>
        imgData ? (
          <div className="dz-processing dz-image-preview position-relative">
            <Row className="row align-items-center thumbnail-preview-dropzone position-relative">
              <Col columnSize={["12"]}>
                <ImageBg className="image-bg">
                  <ImageViewer
                    className="image-previewer avatar-img rounded w-100"
                    src={imgData && imgThumbnail}
                    alt=""
                  />
                  <ImageHover className="hover-blur" onClick={onPick}>
                    Change image
                  </ImageHover>
                </ImageBg>
              </Col>
            </Row>
            <ImageClearButton
              className="btn btn-link image-clear-btn rounded"
              onClick={() => handleClearImg()}
            >
              <MdClear color="grey" />
            </ImageClearButton>
          </div>
        ) : (
          <div className="dropzone dropzone-multiple dz-clickable">
            <div className="dz-default dz-message">
              <button className="dz-button" type="button" onClick={onPick}>
                Add an image
              </button>
            </div>
            <ImageRetriveButton
              className="btn btn-link image-retrive-btn rounded"
              onClick={handleRetriveImg}
            >
              <MdRedo color="grey" />
            </ImageRetriveButton>
          </div>
        )
      }
      onSuccess={(res) =>
        handleUploadSuccessfully({ ...res, name, "data-table": dataTable })
      }
    />
  );
}

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
const ImageClearButton = styled.button`
  position: absolute;
  top: -25px;
  right: 0;
  width: 25px;
  height: 25px;
  padding: 0 !important;
  :hover {
    background-color: #bbbbbb !important;
  }
`;
const ImageRetriveButton = styled.button`
  position: absolute;
  top: -25px;
  right: 0;
  width: 25px;
  height: 25px;
  padding: 0 !important;
  z-index: 1000;
  :hover {
    background-color: #bbbbbb !important;
  }
`;

ImageUploader.propTypes = {
  name: PropTypes.string,
  "data-table": PropTypes.string,
  imgData: PropTypes.arrayOf(PropTypes.object),
  imgThumbnail: PropTypes.string,
  handleUploadSuccessfully: PropTypes.func,
  handleClearImg: PropTypes.func,
};

export default ImageUploader;
