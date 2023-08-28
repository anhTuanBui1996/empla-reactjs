import PropTypes from "prop-types";
import { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFormSubmit,
  setFormSubmit,
} from "../../../../features/editorSlice";
import { MdClose, MdMore } from "react-icons/md";
import Table from "../../../common/Table";
import { selectMetadata } from "../../../../features/metadataSlice";
import {
  mapResultToTableData,
  retrieveAllData,
} from "../../../../services/airtable.service";
import Spinner from "../../../common/Spinner";
import { parseFieldName } from "../../../../utils/stringUtils";
import { compareTwoArrayOfString } from "../../../../utils/arrayUtils";

export default function LinkRecordPicker({
  tabIndex,
  table,
  name,
  label,
  value,
  fieldMetadata,
  onValueChange,
  isRequired,
  readOnly,
}) {
  const dispatch = useDispatch();
  const formSubmit = useSelector(selectFormSubmit);
  const [displayValue, setDisplayValue] = useState(value);
  const [isModalFaded, setIsModalFaded] = useState(false);
  const [isReferenceBoxDisplayed, setIsReferenceBoxDisplayed] = useState(false);
  const [error, setError] = useState({ hasError: false, errorMsg: "" });
  const labelRef = useRef(null);
  const inputRef = useRef(null);

  const handleOpenReferenceBox = () => {
    setIsModalFaded(true);
    setTimeout(() => {
      setIsReferenceBoxDisplayed(true);
    }, 50);
  };
  const handleCloseReferenceBox = () => {
    setIsReferenceBoxDisplayed(false);
    setTimeout(() => {
      setIsModalFaded(false);
    }, 200);
    handleValidate();
  };
  const handleChange = (currentValue) => {
    setDisplayValue(currentValue);
    dispatch(setFormSubmit({ ...formSubmit, [name]: currentValue }));
    if (onValueChange) {
      if (value === undefined && currentValue?.length !== 0) {
        onValueChange({ name, value: true });
      } else if (!compareTwoArrayOfString(currentValue, value)) {
        onValueChange({ name, value: true });
      } else {
        onValueChange({ name, value: false });
        let newObj = {};
        Object.assign(newObj, formSubmit);
        if (newObj[name]) {
          delete newObj[name];
        }
        dispatch(setFormSubmit({ ...newObj }));
      }
    }
  };
  const handleValidate = () => {
    if (
      (displayValue === undefined || displayValue?.length === 0) &&
      isRequired
    ) {
      setError({ hasError: true, errorMsg: `${label} must not be empty!` });
      labelRef.current.scrollIntoView();
    } else {
      setError({ hasError: false, errorMsg: "" });
    }
  };
  return (
    <div className="form-group">
      <span
        id={`LinkRecordPicker_${table}_${name}_label`}
        ref={labelRef}
        style={{ display: "inline-block", marginBottom: "0.5rem" }}
      >
        {`${label} `}
        {isRequired && <span className="text-danger">*</span>}
      </span>
      <div
        className="input-group input-group-merge"
        style={{ cursor: "pointer" }}
        onClick={handleOpenReferenceBox}
      >
        <div
          id={`LinkRecordPicker_${table}_${name}`}
          tabIndex={tabIndex}
          ref={inputRef}
          name={name}
          className="form-control form-control-appended"
          disabled={readOnly}
          style={{ overflowX: "hidden" }}
        >
          {displayValue ? displayValue.length : 0}
        </div>
        <div className="input-group-append">
          <div
            className="input-group-text"
            style={{
              borderTopRightRadius: "0.375rem",
              borderBottomRightRadius: "0.375rem",
            }}
          >
            <MdMore size={20} />
          </div>
        </div>
      </div>
      <LinkReferenceBox
        name={name}
        onCloseModal={handleCloseReferenceBox}
        onSaveChanges={handleChange}
        isModalShow={isReferenceBoxDisplayed}
        isModalFaded={isModalFaded}
        value={displayValue}
        fieldMetadata={fieldMetadata}
      />
      {error.hasError && (
        <div className="err-text text-danger mt-1">{error.errorMsg}</div>
      )}
    </div>
  );
}

function LinkReferenceBox({
  name,
  onCloseModal,
  onSaveChanges,
  isModalShow,
  isModalFaded,
  value,
  fieldMetadata,
}) {
  const baseMetadata = useSelector(selectMetadata);
  const tableMetadata = useMemo(
    () =>
      baseMetadata.tables.find(
        (t) => t.id === fieldMetadata.options.linkedTableId
      ),
    [baseMetadata, fieldMetadata.options.linkedTableId]
  );
  const displayFields = useMemo(() => {
    return tableMetadata.fields
      .filter(
        (f1) => f1.type !== "multipleRecordLinks" && !f1.name.endsWith("Id")
      )
      .map((f2) => f2.name);
  }, [tableMetadata]);

  const dialogModal = useRef(null);
  const [boxValue, setBoxValue] = useState(value);
  const [isFetching, setIsFetching] = useState(false);
  const [originalRecords, setOriginalRecords] = useState(null);

  // eslint-disable-next-line
  useEffect(() => handleFetchingData(), []);

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
      setBoxValue(value);
      onCloseModal();
    }
  };
  const handleCloseModalAndDiscardByClose = (e) => {
    e.stopPropagation();
    setBoxValue(value);
    onCloseModal();
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
    setBoxValue(value);
  };
  const handleSaveChanges = () => {
    if (onSaveChanges) {
      if (value) {
        if (!compareTwoArrayOfString(boxValue, value)) {
          onSaveChanges(boxValue);
        }
      } else {
        if (boxValue?.length) {
          onSaveChanges(boxValue);
        }
      }
    }
    onCloseModal();
  };
  return (
    <div
      className={`modal fade${isModalShow ? " show" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={{
        display: isModalFaded ? "block" : "none",
        backgroundColor: "rgba(0,0,0,0.3)",
        zIndex: 2001,
      }}
      onClick={handleCloseModalAndDiscardByOutclick}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        role="document"
        ref={dialogModal}
      >
        <div className="modal-content">
          <div className="modal-header align-items-center">
            <h3 className="modal-title">{parseFieldName(name)}</h3>
            <button
              type="button"
              className="btn btn-danger px-0 py-0 d-flex justify-content-center align-items-center"
              onClick={handleCloseModalAndDiscardByClose}
              style={{ width: "25px", height: "25px" }}
            >
              <MdClose size={20} />
            </button>
          </div>
          <div className="modal-body">
            {isFetching ? (
              <div className="text-center">
                <Spinner color="#2c7be5" />
              </div>
            ) : (
              <Table
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
                onRefreshDataBtnClick={handleFetchingData}
                isReferenceBox
                currentReferenceBoxValue={boxValue}
                onSelectAllRow={handleSelectAllRow}
                onUnselectAllRow={handleUnselectAllRow}
                onUndoInitialSelectedRow={handleUndoInitialSelect}
              />
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModalAndDiscardByClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
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

LinkRecordPicker.propTypes = {
  tabIndex: PropTypes.number,
  table: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.array,
  fieldMetadata: PropTypes.object,
  onValueChange: PropTypes.func,
  isRequired: PropTypes.bool,
  readOnly: PropTypes.bool,
};
