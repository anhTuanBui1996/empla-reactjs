import React, { useEffect, useState } from "react";
import loadable from "@loadable/component";
import { FILESTACK } from "../../constants";
import Row from "../layout/Row";
import styled from "styled-components";
import Col from "../layout/Col";
import PropTypes from "prop-types";
import { MdClose, MdRotateLeft } from "react-icons/md";
const ReactFilestack = loadable(() => import("filestack-react"));

function FileUploader({
  name,
  "data-table": dataTable,
  imgData,
  mediaType,
  type,
  handleUploadSuccessfully,
}) {
  const [imgStored, setImgStored] = useState(null);
  const handleRetrieveImg = () => {
    handleUploadSuccessfully({
      filesUploaded: [imgStored],
      filesFailed: [],
      name,
      "data-table": dataTable,
    });
  };
  const handleClearImg = () => {
    handleUploadSuccessfully({
      filesFailed: [],
      filesUploaded: [],
      name,
      "data-table": dataTable,
    });
  };
  useEffect(() => {
    if (type === "edit") {
      imgData?.length && setImgStored(imgData[0]);
    } else {
      setImgStored(null);
    }
  }, [imgData, type]);
  return (
    <ReactFilestack
      apikey={FILESTACK.API_KEY}
      customRender={({ onPick }) =>
        imgData?.length ? (
          <div className="dz-processing dz-image-preview position-relative">
            <Row className="row align-items-center thumbnail-preview-dropzone position-relative">
              <Col columnSize={["12"]}>
                <ImageBg className="image-bg">
                  <ImageViewer
                    className="image-previewer avatar-img rounded w-100"
                    src={imgStored?.thumbnails.large.url}
                    alt=""
                  />
                  <ImageHover
                    className="hover-blur"
                    onMouseDownCapture={onPick}
                  >
                    {`Change ${mediaType}`}
                  </ImageHover>
                </ImageBg>
              </Col>
            </Row>
            <ImageClearButton
              className="btn btn-link image-clear-btn rounded"
              onMouseDownCapture={(e) => {
                e.stopPropagation();
                handleClearImg();
              }}
            >
              <MdClose />
            </ImageClearButton>
          </div>
        ) : (
          <div className="dropzone dropzone-multiple dz-clickable position-relative">
            <div className="dz-default dz-message">
              <button
                className="dz-button"
                type="button"
                onMouseDownCapture={onPick}
              >
                {`Add an ${mediaType}`}
              </button>
            </div>
            {imgStored && (
              <ImageRetriveButton
                className="btn btn-link image-clear-btn rounded"
                onMouseDownCapture={(e) => {
                  e.stopPropagation();
                  handleRetrieveImg();
                }}
              >
                <MdRotateLeft />
              </ImageRetriveButton>
            )}
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
  line-height: 1;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 20px;
  width: 25px;
  height: 25px;
  padding: 0 !important;
  color: #ff1919e7 !important;
  :hover {
    background-color: #ff1919e7 !important;
    color: #fff !important;
  }
`;
const ImageRetriveButton = styled.button`
  line-height: 1;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 18px;
  width: 25px;
  height: 25px;
  padding: 0 !important;
  color: #0051ff !important;
  z-index: 1000;
  :hover {
    background-color: #0051ff !important;
    color: #fff !important;
  }
`;

FileUploader.propTypes = {
  name: PropTypes.string,
  "data-table": PropTypes.string,
  "data-type": PropTypes.oneOf([
    "singleLineText",
    "formula",
    "checkbox",
    "longText",
    "attachment",
    "singleSelect",
    "multipleSelect",
    "date",
    "dateTime",
    "lookup",
    "linkToAnotherTable",
  ]),
  imgData: PropTypes.arrayOf(PropTypes.object),
  mediaType: PropTypes.string,
  type: PropTypes.string,
  handleUploadSuccessfully: PropTypes.func,
};

export default FileUploader;
