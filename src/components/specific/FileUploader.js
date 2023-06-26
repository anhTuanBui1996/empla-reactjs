import React, { useEffect, useMemo } from "react";
import Row from "../layout/Row";
import styled from "styled-components";
import Col from "../layout/Col";
import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { selectFormData, setFormData } from "../../features/editorSlice";

function FileUploader({ id, tabIndex, name, fileData }) {
  const dispatch = useDispatch();
  const editorFormData = useSelector(selectFormData);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const imagePreview = useMemo(() => {
    if (fileData) {
      if (fileData.length) {
        if (fileData[0].thumbnails) {
          let thumbnails = Object.values(fileData[0].thumbnails);
          return thumbnails[thumbnails.length - 1].url;
        }
      }
    }
    return undefined;
  }, [fileData]);
  useEffect(() => {
    if (acceptedFiles.length) {
      let resultFiles = acceptedFiles.map((file) => {
        let url = URL.createObjectURL(file);
        return Object.assign(file, {
          thumbnails: { full: { url } },
          url,
        });
      });
      dispatch(setFormData({ ...editorFormData, [name]: resultFiles }));
    }
    return () => imagePreview && URL.revokeObjectURL(imagePreview);
  }, [acceptedFiles, dispatch, editorFormData, imagePreview, name]);
  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps({ name, id })} />
      <div className="dz-processing dz-image-preview position-relative mt-1">
        <Row className="row align-items-center thumbnail-preview-dropzone position-relative">
          <Col columnSize={["12"]}>
            <ImageBg className="image-bg">
              {imagePreview ? (
                <>
                  <ImageViewer
                    className="image-previewer avatar-img rounded w-100"
                    src={imagePreview}
                    alt="previewer"
                  />
                  <ImageHover tabIndex={tabIndex} className="hover-blur">
                    Change attachment file
                  </ImageHover>
                </>
              ) : (
                <div
                  id={id}
                  className="dropzone dropzone-multiple dz-clickable position-relative"
                >
                  <div className="dz-default dz-message">
                    <button
                      tabIndex={tabIndex}
                      className="dz-button"
                      type="button"
                    >
                      Add attachment file
                    </button>
                  </div>
                </div>
              )}
            </ImageBg>
          </Col>
        </Row>
      </div>
    </div>
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

FileUploader.propTypes = {
  id: PropTypes.string,
  tabIndex: PropTypes.number,
  name: PropTypes.string,
  fileData: PropTypes.arrayOf(PropTypes.object),
};

export default FileUploader;
