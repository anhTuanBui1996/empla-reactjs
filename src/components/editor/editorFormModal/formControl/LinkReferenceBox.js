import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import Table from "../../../common/Table/Table";
import { selectMetadata } from "../../../../features/metadataSlice";
import {
  mapResultToTableData,
  retrieveAllData,
} from "../../../../services/airtable.service";
import Spinner from "../../../common/Spinner";
import { MdClose } from "react-icons/md";
import { parseFieldName } from "../../../../utils/stringUtils";
import { useDispatch, useSelector } from "react-redux";
import { compareTwoArrayOfString } from "../../../../utils/arrayUtils";
import {
  selectFormSubmit,
  selectLinkReferenceFieldMetadata,
  selectLinkReferenceModalFaded,
  selectLinkReferenceModalShow,
  selectLinkReferenceName,
  selectLinkReferenceValue,
  setFormSubmit,
  closeLinkReferenceBox,
  closeLinkReferenceBackground,
  clearLinkReferenceBoxContent,
  selectFormData,
} from "../../../../features/editorSlice";

export default function LinkReferenceBox() {
  const dispatch = useDispatch();
  const baseMetadata = useSelector(selectMetadata);
  const fieldMetadata = useSelector(selectLinkReferenceFieldMetadata);
  const tableMetadata = useMemo(
    () =>
      fieldMetadata &&
      baseMetadata.tables.find(
        (t) => t.id === fieldMetadata?.options.linkedTableId
      ),
    [baseMetadata, fieldMetadata]
  );
  const displayFields = useMemo(() => {
    return tableMetadata?.fields
      .filter(
        (f1) => f1.type !== "multipleRecordLinks" && !f1.name.endsWith("Id")
      )
      .map((f2) => f2.name);
  }, [tableMetadata]);

  const name = useSelector(selectLinkReferenceName);
  const linkReferenceBoxShow = useSelector(selectLinkReferenceModalShow);
  const linkReferenceBoxFaded = useSelector(selectLinkReferenceModalFaded);
  const linkReferenceBoxName = useSelector(selectLinkReferenceName);
  const linkReferenceBoxValue = useSelector(selectLinkReferenceValue);
  const formData = useSelector(selectFormData);
  const formSubmit = useSelector(selectFormSubmit);
  const currentOriginalValue = useMemo(
    () => (formData && formData[name]) || [],
    [formData, name]
  );

  const dialogModal = useRef(null);
  const [boxValue, setBoxValue] = useState(linkReferenceBoxValue);
  const [isFetching, setIsFetching] = useState(false);
  const [originalRecords, setOriginalRecords] = useState([]);

  // eslint-disable-next-line
  useEffect(() => {
    if (tableMetadata) {
      setTimeout(handleFetchingData, 500);
    }
    // eslint-disable-next-line
  }, [tableMetadata]);
  useEffect(() => {
    setBoxValue(linkReferenceBoxValue);
  }, [linkReferenceBoxValue]);

  // Handlers for LinkReferenceBox
  const handleFetchingData = () => {
    setIsFetching(true);
    retrieveAllData(tableMetadata.id)
      .then((data) => {
        setOriginalRecords(data);
        setIsFetching(false);
      })
      .catch((err) => console.error(err));
  };
  const handleCloseModalAndDiscardByOutclick = (e) => {
    e.stopPropagation();
    let { target } = e;
    if (!dialogModal.current.contains(target)) {
      dispatch(closeLinkReferenceBox());
      setTimeout(() => dispatch(closeLinkReferenceBackground()), 300);
      setTimeout(() => {
        dispatch(clearLinkReferenceBoxContent());
        setOriginalRecords([]);
      }, 300);
    }
  };
  const handleCloseModalAndDiscardByClose = (e) => {
    e.stopPropagation();
    setBoxValue(linkReferenceBoxValue);
    dispatch(closeLinkReferenceBox());
    setTimeout(() => dispatch(closeLinkReferenceBackground()), 300);
    setTimeout(() => {
      dispatch(clearLinkReferenceBoxContent());
      setOriginalRecords([]);
    }, 300);
  };
  const handleSelectRow = (mappedRow) => {
    let currentSelectRecordId = mappedRow.rowId;
    let foundIndex = boxValue?.indexOf(currentSelectRecordId);
    if (foundIndex === -1 || foundIndex === undefined) {
      if (boxValue) {
        setBoxValue([...boxValue, currentSelectRecordId]);
      } else {
        setBoxValue([currentSelectRecordId]);
      }
    } else {
      setBoxValue(boxValue.filter((v) => v !== currentSelectRecordId));
    }
  };
  const handleSelectAllRow = () => {
    setBoxValue(originalRecords?.map((orgRec) => orgRec.id));
  };
  const handleUnselectAllRow = () => {
    setBoxValue([]);
  };
  const handleUndoInitialSelect = () => {
    setBoxValue(linkReferenceBoxValue);
  };
  const handleSaveChanges = () => {
    if (!compareTwoArrayOfString(boxValue, currentOriginalValue)) {
      dispatch(
        setFormSubmit({ ...formSubmit, [linkReferenceBoxName]: boxValue })
      );
    } else {
      let newObj = {};
      Object.assign(newObj, formSubmit);
      if (newObj[linkReferenceBoxName]) {
        delete newObj[linkReferenceBoxName];
      }
      dispatch(setFormSubmit({ ...newObj }));
    }
    dispatch(closeLinkReferenceBox());
    setTimeout(() => dispatch(closeLinkReferenceBackground()), 300);
    setTimeout(() => {
      dispatch(clearLinkReferenceBoxContent());
      setOriginalRecords([]);
    }, 300);
  };
  return (
    <div
      className={`link-reference-box modal fade${
        linkReferenceBoxShow ? " show" : ""
      }`}
      tabIndex="-1"
      role="dialog"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        display: linkReferenceBoxFaded ? "block" : "none",
        backgroundColor: "rgba(0,0,0,0.3)",
        zIndex: 2001,
        transform: "none",
        transition: "opacity 0.2s linear, visibility 0.2s linear",
        visibility: linkReferenceBoxFaded ? "visible" : "hidden",
        opacity: linkReferenceBoxFaded ? "1" : "0",
      }}
      onClick={handleCloseModalAndDiscardByOutclick}
    >
      <div
        className="link-reference-box modal-dialog modal-dialog-centered"
        role="document"
        ref={dialogModal}
      >
        <div
          className="link-reference-box modal-content"
          style={{
            scrollBehavior: "smooth",
            visibility: linkReferenceBoxShow ? "visible" : "hidden",
            opacity: linkReferenceBoxShow ? "1" : "0",
            position: "absolute",
            top: `${linkReferenceBoxShow ? "50%" : "30%"}`,
            left: "50%",
            transform: "translate(-50%, -50%)",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <div className="link-reference-box modal-header align-items-center">
            <h3 className="link-reference-box modal-title">
              {name ? parseFieldName(name) : ""}
            </h3>
            <button
              type="button"
              className="link-reference-box btn btn-danger link-reference-box-close px-0 py-0 d-flex justify-content-center align-items-center"
              onClick={handleCloseModalAndDiscardByClose}
              style={{ width: "25px", height: "25px" }}
            >
              <MdClose className="link-reference-box" size={20} />
            </button>
          </div>
          <div className="link-reference-box modal-body pt-2">
            {isFetching ? (
              <div className="link-reference-box text-center mt-3">
                <Spinner color="#2c7be5" />
              </div>
            ) : (
              tableMetadata && (
                <Table
                  classNamePrefix="link-reference-box"
                  tableId={`reference-table_${name}`}
                  fieldList={displayFields}
                  metadata={tableMetadata}
                  originalRecords={originalRecords ? originalRecords : []}
                  mappedRecords={mapResultToTableData(
                    originalRecords ? originalRecords : [],
                    tableMetadata.name,
                    displayFields,
                    tableMetadata
                  )}
                  onRecordClick={handleSelectRow}
                  recordPerPage={4}
                  hasSettings
                  hasSearching
                  hasSorting
                  hasFilterRow
                  onRefreshDataBtnClick={handleFetchingData}
                  isReferenceBox
                  currentReferenceBoxValue={boxValue}
                  onSelectAllRow={handleSelectAllRow}
                  onUnselectAllRow={handleUnselectAllRow}
                  onUndoInitialSelectedRow={handleUndoInitialSelect}
                />
              )
            )}
          </div>
          <div className="link-reference-box modal-footer">
            <button
              type="button"
              className="link-reference-box btn btn-secondary"
              onClick={handleCloseModalAndDiscardByClose}
            >
              Close
            </button>
            <button
              type="button"
              className="link-reference-box btn btn-primary"
              onClick={handleSaveChanges}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

LinkReferenceBox.propTypes = {
  name: PropTypes.string,
  onCloseModal: PropTypes.func,
  onSaveChanges: PropTypes.func,
  isModalShow: PropTypes.bool,
  isModalFaded: PropTypes.bool,
  linkReferenceBoxValue: PropTypes.any,
  fieldMetadata: PropTypes.any,
};
