import React, { useEffect, useMemo, useState } from "react";
import Row from "../layout/Row";
import styled from "styled-components";
import Col from "../layout/Col";
import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import { compareTwoArrayOfObject } from "../../utils/arrayUtils";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { thumbnailForType } from "../../assets/options/FileUploaderOptions";
import { useDispatch, useSelector } from "react-redux";
import { selectFormSubmit, setFormSubmit } from "../../features/editorSlice";

function FileUploader({
  id,
  tabIndex,
  name,
  fileData,
  acceptedTypes,
  maxFiles,
  onFileChange,
  onDrop,
}) {
  const [componentAvailable, setComponentAvailable] = useState(true);
  const [isImagePreviewLoaded, setIsImagePreviewLoaded] = useState(false);
  const dispatch = useDispatch();
  const formSubmit = useSelector(selectFormSubmit);

  const handleChangeFiles = () => {
    if (!compareTwoArrayOfObject(displayFiles, originalFiles)) {
      if (onDrop) {
        onDrop(displayFiles);
      }
      if (onFileChange) {
        onFileChange({ name, value: true });
      }
    } else {
      if (onFileChange) {
        onFileChange({ name, value: false });
      }
      if (onDrop) {
        let newObj = {};
        Object.assign(newObj, formSubmit);
        if (newObj[name]) {
          delete newObj[name];
        }
        dispatch(setFormSubmit({ ...newObj }));
      }
    }
  };
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone(
    componentAvailable
      ? { accept: acceptedTypes, maxFiles, onDrop: handleChangeFiles }
      : undefined
  );

  const originalFiles = useMemo(() => {
    if (fileData) {
      return fileData.map(({ id, url, thumbnails, type, fileName }) => ({
        id,
        url,
        thumbnails,
        type,
        fileName,
      }));
    } else return [];
  }, [fileData]);

  const addedFiles = useMemo(() => {
    if (acceptedFiles) {
      return acceptedFiles.map((file) => {
        let localFileURL = URL.createObjectURL(file);
        return {
          url: localFileURL,
          thumbnails: { full: { url: localFileURL } },
          type: file.type,
          name: file.name,
        };
      });
    }
  }, [acceptedFiles]);

  const [displayFiles, setDisplayFiles] = useState([]);
  const [existedFiles, setExistedFiles] = useState(originalFiles);
  const [localFiles, setLocalFiles] = useState(addedFiles);
  const [currentFileDisplayIndex, setCurrentFileDisplayIndex] = useState(0);

  useEffect(() => {
    setCurrentFileDisplayIndex(0);
    if (!compareTwoArrayOfObject(localFiles, addedFiles)) {
      setLocalFiles(addedFiles);
    }
    if (!compareTwoArrayOfObject(existedFiles, originalFiles)) {
      setExistedFiles(originalFiles);
    }
    // eslint-disable-next-line
  }, [acceptedFiles, originalFiles]);
  useEffect(() => {
    let newFiles = [];
    newFiles = newFiles.concat(existedFiles).concat(localFiles);
    if (!compareTwoArrayOfObject(newFiles, displayFiles)) {
      while (newFiles.length > maxFiles) {
        newFiles.shift();
      }
      setDisplayFiles(newFiles);
    }
    // eslint-disable-next-line
  }, [existedFiles, localFiles]);

  // Generate url src for img tag preview
  const imagePreviews = useMemo(() => {
    if (displayFiles) {
      if (displayFiles.length && displayFiles[0]) {
        return displayFiles.map((file) => {
          let id = file.id;
          let thumbnails = Object.values(file.thumbnails);
          let fileType = file.type;
          if (!id) {
            // file on local
            let srcImg = thumbnailForType[fileType];
            if (srcImg) {
              return srcImg;
            } else {
              return thumbnailForType.unknown;
            }
          }
          return thumbnails[thumbnails.length - 1].url;
        });
      }
    }
    return undefined;
  }, [displayFiles]);

  // Unmount component
  useEffect(() => {
    return () => {
      imagePreviews && URL.revokeObjectURL(imagePreviews);
      setComponentAvailable(false);
    };
    // eslint-disable-next-line
  }, []);

  // Handler
  const handleDisplayNextFile = (e) => {
    e.stopPropagation();
    setCurrentFileDisplayIndex(currentFileDisplayIndex + 1);
  };
  const handleDisplayPreviousFile = (e) => {
    e.stopPropagation();
    setCurrentFileDisplayIndex(currentFileDisplayIndex - 1);
  };

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps({ name, id })} />
      <div className="dz-processing dz-image-preview position-relative mt-1">
        <Row className="row align-items-center thumbnail-preview-dropzone position-relative">
          <Col columnSize={["12"]}>
            <ImageBg className="image-bg">
              {imagePreviews ? (
                <>
                  <div className="dropzone-preview position-relative">
                    <ImageViewer
                      className="image-previewer avatar-img rounded w-100"
                      src={imagePreviews[currentFileDisplayIndex]}
                      alt="previewer"
                      onLoadCapture={() => setIsImagePreviewLoaded(true)}
                    />
                    <ImageHover tabIndex={tabIndex} className="hover-blur">
                      Change attachment file
                      <span
                        style={{
                          width: "100%",
                          textAlign: "center",
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      >
                        {!displayFiles[currentFileDisplayIndex].id &&
                        displayFiles[currentFileDisplayIndex].name.length > 25
                          ? `${displayFiles[currentFileDisplayIndex].name.slice(
                              0,
                              24
                            )}...`
                          : displayFiles[currentFileDisplayIndex].name}
                      </span>
                    </ImageHover>
                  </div>
                  {imagePreviews?.length > 1 && (
                    <>
                      {currentFileDisplayIndex > 0 && (
                        <button
                          className="border-0 rounded btn-primary px-1 position-absolute previous-attachment"
                          style={{
                            top: "50%",
                            transform: "translateY(-50%)",
                            left: 0,
                            outline: "none",
                            boxShadow: "none",
                          }}
                          onClick={handleDisplayPreviousFile}
                        >
                          <MdKeyboardArrowLeft />
                        </button>
                      )}
                      {currentFileDisplayIndex < imagePreviews.length - 1 && (
                        <button
                          className="border-0 rounded btn-primary px-1 position-absolute next-attachment"
                          style={{
                            top: "50%",
                            transform: "translateY(-50%)",
                            right: 0,
                            outline: "none",
                            boxShadow: "none",
                          }}
                          onClick={handleDisplayNextFile}
                        >
                          <MdKeyboardArrowRight />
                        </button>
                      )}
                    </>
                  )}
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
  /**
   * Object of MIME types
   * * example: { "image/*": [".jpg", ".png", ".jpeg"], "application/pdf": [".pdf"] },
   */
  acceptedTypes: PropTypes.object,
  maxFiles: PropTypes.number,
  onFileChange: PropTypes.func,
  onDrop: PropTypes.func,
};

export default FileUploader;
