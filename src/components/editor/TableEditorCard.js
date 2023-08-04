import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import Card, { ExtensionItemBtn } from "../common/Card";
import Table from "../common/Table";
import dto from "./config/dtoConfig";
import slice from "./config/sliceConfig";
import RightSideFormModal from "./rightSideFormModal/RightSideFormModal";
import { useDispatch, useSelector } from "react-redux";
import { mapResultToTableData } from "../../services/airtable.service";
import { selectMetadata } from "../../features/metadataSlice";
import { useEffect } from "react";
import { MdArticle, MdTableView } from "react-icons/md";

// remmember importing new Dto/slices if having any changes in Airtable schema
function TableEditorCard({ cardLabel, tableInfoArr }) {
  const dispatch = useDispatch();

  // retrieve and loading selectors
  const selectors = {
    Staff: {
      records: useSelector(slice.Staff.selections.selectStaffTableData),
      loading: useSelector(slice.Staff.selections.selectLoading),
    },
  };
  const baseMetadata = useSelector(selectMetadata);

  // run all table get table record data async thunk when initializing
  useEffect(() => {
    tableInfoArr.forEach(({ tableName }) => {
      dispatch(slice[tableName].cruds.retrieve());
    });
    // eslint-disable-next-line
  }, []);

  const [cardTabActice, setCardTabActive] = useState(0);
  const [isModalDisplay, setIsModalDisplay] = useState(false);
  const [modalType, setModalType] = useState("create");

  const tableArr = useMemo(
    () =>
      tableInfoArr.map(({ tableLabel, tableName, fieldList }) => {
        // static component/data
        let tableMetadata = baseMetadata.tables.find(
          (table) => table.name === tableName
        );
        let tableModel = dto[tableName].model;
        let isRequiredFields = dto[tableName].isRequiredFields;
        let isReadOnlyFields = dto[tableName].isReadOnlyFields;
        let createNew = slice[tableName].cruds.createNewStaff;
        let updateExisting = slice[tableName].cruds.updateExistingStaff;
        let deleteExisting = slice[tableName].cruds.deleteExistingStaff;

        let tableRecords = selectors[tableName].records;
        let mappedRecords = tableRecords
          ? mapResultToTableData(
              tableRecords,
              tableName,
              fieldList,
              tableMetadata
            )
          : [];
        let isLoading = selectors[tableName].loading;
        switch (tableName) {
          case "Staff":
            break;
          default:
            console.error("Doesn't find any table of" + tableName);
            break;
        }
        return {
          tableMetadata,
          tableLabel,
          tableName,
          fieldList,
          tableModel,
          tableRecords,
          mappedRecords,
          isRequiredFields,
          isReadOnlyFields,
          createNew,
          updateExisting,
          deleteExisting,
          isLoading,
        };
      }),
    // eslint-disable-next-line
    [tableInfoArr, selectors]
  );

  // Handlers
  const handleClickRefreshButton = () => {
    dispatch(slice[tableArr[cardTabActice].tableName].cruds.retrieve());
  };
  const handleOpenRightSideModalForCreate = () => {
    setModalType("create");
    setIsModalDisplay(true);
  };
  const handleOpenRightSideModalForEdit = () => {
    setModalType("edit");
    setIsModalDisplay(true);
  };
  const handleCloseRightSideModal = () => {
    setModalType("create");
    setIsModalDisplay(false);
  };
  const handleRightSideModalFormSubmitted = () => {};

  return (
    <>
      <Card
        cardHeader={{
          title: cardLabel,
          extension: (
            <>
              <ExtensionItemBtn>
                <MdArticle />
                {` Download as .csv`}
              </ExtensionItemBtn>
              <ExtensionItemBtn>
                <MdTableView />
                {` Download as .xls`}
              </ExtensionItemBtn>
            </>
          ),
          navList: tableArr.map(({ tableLabel }) => tableLabel),
        }}
        elementList={tableArr.map(
          ({ tableMetadata, tableRecords, mappedRecords, fieldList }) => (
            <Table
              metadata={tableMetadata}
              fieldList={fieldList}
              originalRecords={tableRecords}
              mappedRecords={mappedRecords}
              hasSettings
              hasSearching
              onRecordClick={handleOpenRightSideModalForEdit}
              onCreateNewBtnClick={handleOpenRightSideModalForCreate}
              onRefreshDataBtnClick={handleClickRefreshButton}
            />
          )
        )}
        isLoading={tableArr[cardTabActice].isLoading}
        noBodyPadding
        onChangeTab={setCardTabActive}
      />
      <RightSideFormModal
        formName={tableArr[cardTabActice].tableName}
        model={tableArr[cardTabActice].tableModel}
        requiredFields={tableArr[cardTabActice].isRequiredFields}
        readOnlyFields={tableArr[cardTabActice].isReadOnlyFields}
        isModalDisplay={isModalDisplay}
        type={modalType}
        handleCloseForm={handleCloseRightSideModal}
        onFormSubmitted={handleRightSideModalFormSubmitted}
        createAndModifySlice={
          modalType === "create"
            ? tableArr[cardTabActice].createNew
            : tableArr[cardTabActice].updateExisting
        }
        deleteSlice={tableArr[cardTabActice].deleteExisting}
      />
    </>
  );
}

TableEditorCard.propTypes = {
  cardLabel: PropTypes.string,
  tableInfoArr: PropTypes.arrayOf(
    PropTypes.shape({
      tableLabel: PropTypes.string,
      tableName: PropTypes.string,
      fieldList: PropTypes.array,
    })
  ),
};

export default TableEditorCard;
