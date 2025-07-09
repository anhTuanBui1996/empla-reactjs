import React, { useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { setBadgeTheme } from "../../../../utils/setBadgeTheme";
import { useSelector } from "react-redux";
import { selectMetadata } from "../../../../features/metadataSlice";
import { selectFormSubmit } from "../../../../features/editorSlice";
import { useEffect } from "react";
import { retrieveAllData } from "../../../../services/airtable.service";

function LookUpValues({ tabIndex, table, name, label, value, fieldMetadata }) {
  const [isMounted, setIsMounted] = useState(true);

  const labelRef = useRef(null);
  const formSubmit = useSelector(selectFormSubmit);

  const baseMetadata = useSelector(selectMetadata);
  const tableMetadata = useMemo(
    () => baseMetadata?.tables.find((tbl) => tbl.name === table),
    [baseMetadata, table]
  );
  const linkedTableMetadata = useMemo(() => {
    let recordLinkField = tableMetadata.fields.find(
      (fld) => fld.id === fieldMetadata.options.recordLinkFieldId
    );
    return baseMetadata?.tables.find(
      (tbl) => tbl.id === recordLinkField?.options.linkedTableId
    );
  }, [
    tableMetadata,
    baseMetadata?.tables,
    fieldMetadata.options.recordLinkFieldId,
  ]);

  const [displayValue, setDisplayValue] = useState(value);
  const [isFetching, setIsFetching] = useState(false);
  const [originalRecords, setOriginalRecords] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    handleFetchingData();
    return () => setIsMounted(false);
  // eslint-disable-next-line
  }, []);

  // render lookup values base on formSubmit
  useEffect(() => {
    let linkedFieldId = fieldMetadata.options.recordLinkFieldId;
    let linkedFieldName = tableMetadata.fields.find(
      (fld) => fld.id === linkedFieldId
    )?.name;
    if (linkedFieldName) {
      if (formSubmit[linkedFieldName]) {
        let selectedRecords = originalRecords?.filter(
          (rec) => formSubmit[linkedFieldName].indexOf(rec.id) !== -1
        );
        let lookupFieldNameInLinkedTable = linkedTableMetadata?.fields.find(
          (fld) => fld.id === fieldMetadata?.options.fieldIdInLinkedTable
        )?.name;
        setDisplayValue(
          selectedRecords?.map(
            (rec) => rec.fields[lookupFieldNameInLinkedTable]
          )
        );
      }
    }
    // eslint-disable-next-line
  }, [
    formSubmit,
    fieldMetadata.options.recordLinkFieldId,
    tableMetadata.fields,
  ]);

  const handleFetchingData = () => {
    setIsFetching(true);
    retrieveAllData(linkedTableMetadata.name)
      .then((data) => {
        if (isMounted) {
          setOriginalRecords(data);
          setIsFetching(false);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className="form-group">
        <span
          id={`LookUpValues_${table}_${name}_label`}
          ref={labelRef}
          style={{ display: "inline-block", marginBottom: "0.5rem" }}
        >
          {`${label} `}
        </span>
        <div
          id={`LookUpValues_${table}_${name}`}
          tabIndex={tabIndex}
          className="form-control position-relative bg-light"
          readOnly
          disabled
          style={{ height: "85.5px" }}
        >
          {isFetching ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div className="w-100 h-100" style={{ overflow: "auto" }}>
              {displayValue?.map((item, i) => {
                let sourceType = fieldMetadata.options.result.type;
                switch (sourceType) {
                  case "singleLineText":
                  case "longText":
                    return <div key={i}>{item}</div>;
                  case "singleSelect":
                    let foundColorName =
                      fieldMetadata.options.result.options.choices.find(
                        (c) => c.name === item
                      )?.color;
                    let styles = {};
                    return (
                      <div key={i}>
                        <span
                          className="badge"
                          style={setBadgeTheme(foundColorName, styles)}
                        >
                          {item}
                        </span>
                        <br />
                      </div>
                    );
                  case "multipleSelects":
                    return (
                      <div key={i}>
                        {item.map((subItem, j) => (
                          <span
                            key={j}
                            className="badge mr-1"
                            style={setBadgeTheme(foundColorName, styles)}
                          >
                            {subItem}
                          </span>
                        ))}
                        <br />
                      </div>
                    );
                  case "checkbox":
                    return (
                      <input
                        type="checkbox"
                        key={i}
                        readOnly
                        disabled
                        checked={item ? true : false}
                      />
                    );
                  default:
                    console.error(
                      "Unknown source type in LookUpValues form control",
                      sourceType
                    );
                    return <div key={i}></div>;
                }
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

LookUpValues.propTypes = {
  tabIndex: PropTypes.number,
  table: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  baseMetadata: PropTypes.object,
  fieldMetadata: PropTypes.object,
};

export default LookUpValues;
