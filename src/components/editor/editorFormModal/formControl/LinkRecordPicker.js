import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFormSubmit,
  openLinkReferenceBox,
  setLinkReferenceBoxContent,
  setFormError,
  selectFormError,
  openLinkReferenceBackground,
} from "../../../../features/editorSlice";
import { MdMore } from "react-icons/md";
import { retrieveAllData } from "../../../../services/airtable.service";
import { selectMetadata } from "../../../../features/metadataSlice";

export default function LinkRecordPicker({
  tabIndex,
  table,
  name,
  label,
  value,
  fieldMetadata,
  isRequired,
  readOnly,
}) {
  const [isMounted, setIsMounted] = useState(true);

  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(false);
  const baseMetadata = useSelector(selectMetadata);
  const tableMetadata = useMemo(
    () =>
      fieldMetadata &&
      baseMetadata.tables.find(
        (t) => t.id === fieldMetadata?.options.linkedTableId
      ),
    [baseMetadata, fieldMetadata]
  );
  const formSubmit = useSelector(selectFormSubmit);
  const displayValue = useMemo(() => {
    if (!formSubmit[name] && value) {
      return value;
    } else if (formSubmit[name]) {
      return formSubmit[name];
    } else {
      return [];
    }
  }, [value, name, formSubmit]);
  const [labelString, setLabelString] = useState("");
  const formError = useSelector(selectFormError);
  const formControlError = useMemo(() => formError[name], [formError, name]);
  const labelRef = useRef(null);
  const inputRef = useRef(null);

  const handleOpenReferenceBox = () => {
    dispatch(
      setLinkReferenceBoxContent({ name, fieldMetadata, value: displayValue })
    );
    setTimeout(() => dispatch(openLinkReferenceBackground()), 50);
    setTimeout(() => dispatch(openLinkReferenceBox()), 200);
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (formControlError?.hasError && isRequired) {
      dispatch(
        setFormError({
          ...formError,
          [name]: {
            hasError: true,
            errorMsg: `${label} must not be empty!`,
          },
        })
      );
      labelRef.current.scrollIntoView();
    } else {
      let newObj = {};
      Object.assign(newObj, formError);
      if (newObj[name]) {
        delete newObj[name];
      }
      dispatch(setFormError({ ...newObj }));
    }
    // eslint-disable-next-line
  }, [formControlError]);

  useEffect(() => {
    if (tableMetadata) {
      if (displayValue && displayValue.length > 0) {
        retrieveAllData(tableMetadata.name)
          .then((returnValue) => {
            if (isMounted) {
              let displayLabel = "";
              returnValue.forEach((r) => {
                if (
                  (r.fields.Name || r.fields.FullName || r.fields.Token) &&
                  displayValue.includes(r.id)
                ) {
                  displayLabel +=
                    (r.fields.Name || r.fields.FullName || r.fields.Token) +
                    ", ";
                }
              });
              displayLabel = displayLabel.slice(0, displayLabel.length - 2);
              if (displayLabel.length > 80) {
                displayLabel = displayLabel.slice(0, 79) + "...";
              }
              setLabelString(displayLabel);
            }
          })
          .catch((error) => console.error(error))
          .finally(() => isMounted && setIsFetching(false));
      } else {
        setLabelString("...");
      }
    }
    // eslint-disable-next-line
  }, [fieldMetadata, displayValue, tableMetadata]);

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
          {isFetching ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            labelString
          )}
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
      {formControlError?.hasError && (
        <div className="err-text text-danger mt-1">
          {formControlError.errorMsg}
        </div>
      )}
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
