import React, { useEffect, useMemo } from "react";
import Row from "../layout/Row";
import styled from "styled-components";
import Col from "../layout/Col";
import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { selectFormData } from "../../features/editorSlice";

function FileUploader({ id, tabIndex, name, imgData }) {
  const dispatch = useDispatch();
  const editorFormData = useSelector(selectFormData);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      acceptedFiles.map((file) => {
        let url = URL.createObjectURL(file);
        Object.assign(file, {
          thumbnails: { full: { url } },
          url,
        });
      });
    },
  });
  const imagePreview = useMemo(() => {
    if (imgData) {
      if (imgData[0].thumbnails) {
        let thumbnails = Object.values(imgData[0].thumbnails);
        return thumbnails[thumbnails.length - 1].url;
      }
    }
    return undefined;
  }, [imgData]);
  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => imgData.forEach((file) => URL.revokeObjectURL(file.url));
  }, []);
  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps({ name, id })} />
      <div className="dz-processing dz-image-preview position-relative mt-1">
        <Row className="row align-items-center thumbnail-preview-dropzone position-relative">
          <Col columnSize={["12"]}>
            <ImageBg className="image-bg">
              <ImageViewer
                className="image-previewer avatar-img rounded w-100"
                src={imagePreview}
                alt="previewer"
              />
              <ImageHover tabIndex={tabIndex} className="hover-blur">
                Change attachment file
              </ImageHover>
            </ImageBg>
          </Col>
        </Row>
      </div>
    </div>
  );
  return;
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

FileUploader.propTypes = {
  id: PropTypes.string,
  tabIndex: PropTypes.number,
  name: PropTypes.string,
  imgData: PropTypes.arrayOf(PropTypes.object),
  type: PropTypes.string,
  handleUploadSuccessfully: PropTypes.func,
};

export default FileUploader;
