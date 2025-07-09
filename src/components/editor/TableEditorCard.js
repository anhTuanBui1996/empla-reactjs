import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import Card, { ExtensionItemBtn } from "../common/Card";
import Table from "../common/Table/Table";
import dto from "./config/dtoConfig";
import slice from "./config/sliceConfig";
import FormModal from "./editorFormModal/FormModal";
import { useDispatch, useSelector } from "react-redux";
import { mapResultToTableData } from "../../services/airtable.service";
import { selectMetadata } from "../../features/metadataSlice";
import { useEffect } from "react";
import { MdArticle, MdTableView } from "react-icons/md";
import LinkReferenceBox from "./editorFormModal/formControl/LinkReferenceBox";

/**
 * Remmember importing new Dto/slices if having any changes in Airtable schema
 */
function TableEditorCard({ cardLabel, tableInfoArr }) {
  const dispatch = useDispatch();

  // retrieve and loading selectors
  const selectors = {
    Staff: {
      records: useSelector(slice.Staff.selections.tableData),
      loading: useSelector(slice.Staff.selections.loading),
    },
    Role: {
      records: useSelector(slice.Role.selections.tableData),
      loading: useSelector(slice.Role.selections.loading),
    },
    WorkingPlace: {
      records: useSelector(slice.WorkingPlace.selections.tableData),
      loading: useSelector(slice.WorkingPlace.selections.loading),
    },
    Collaboratory: {
      records: useSelector(slice.Collaboratory.selections.tableData),
      loading: useSelector(slice.Collaboratory.selections.loading),
    },
    Tasks: {
      records: useSelector(slice.Tasks.selections.tableData),
      loading: useSelector(slice.Tasks.selections.loading),
    },
  };
  const baseMetadata = useSelector(selectMetadata);

  // run all table get table record data async thunk when initializing
  useEffect(() => {
    tableInfoArr.forEach(({ tableName }) => {
      dispatch(slice[tableName].cruds.read());
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
        let createNew = slice[tableName].cruds.create;
        let updateExisting = slice[tableName].cruds.update;
        let deleteExisting = slice[tableName].cruds.delete;

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

  // Handlers for Table
  const handleClickRefreshButton = () => {
    dispatch(slice[tableArr[cardTabActice].tableName].cruds.read());
  };
  const handleOpenFormModalForCreate = () => {
    setModalType("create");
    setIsModalDisplay(true);
  };
  const handleOpenFormModalForEdit = () => {
    setModalType("edit");
    setIsModalDisplay(true);
  };
  const handleCloseFormModal = () => {
    setIsModalDisplay(false);
    setModalType("create");
  };
  const handleFormModalFormSubmitted = () => {
    handleCloseFormModal();
    handleClickRefreshButton();
  };

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
          ({ tableMetadata, tableRecords, mappedRecords, fieldList }, i) => (
            <Table
              tableId={`table-editor-${i}`}
              metadata={tableMetadata}
              fieldList={fieldList}
              originalRecords={tableRecords}
              mappedRecords={mappedRecords}
              hasSettings
              hasSearching
              hasSorting
              hasFilterRow
              onRecordClick={handleOpenFormModalForEdit}
              onCreateNewBtnClick={handleOpenFormModalForCreate}
              onRefreshDataBtnClick={handleClickRefreshButton}
            />
          )
        )}
        isLoading={tableArr[cardTabActice].isLoading}
        noBodyPadding
        onChangeTab={setCardTabActive}
      />
      <FormModal
        formName={tableArr[cardTabActice].tableName}
        model={tableArr[cardTabActice].tableModel}
        requiredFields={tableArr[cardTabActice].isRequiredFields}
        readOnlyFields={tableArr[cardTabActice].isReadOnlyFields}
        isModalDisplay={isModalDisplay}
        type={modalType}
        handleCloseForm={handleCloseFormModal}
        onFormSubmitted={handleFormModalFormSubmitted}
        createAndModifySlice={
          modalType === "create"
            ? tableArr[cardTabActice].createNew
            : tableArr[cardTabActice].updateExisting
        }
        deleteSlice={tableArr[cardTabActice].deleteExisting}
      />
      <LinkReferenceBox />
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
