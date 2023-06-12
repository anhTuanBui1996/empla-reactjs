import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/common/Loader";
import {
  retrieveBaseMetadata,
  selectLoading,
  selectMetadata,
} from "../features/metadataSlice";

function AirtableMetadata({ children }) {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const baseTablesMetadata = useSelector(selectMetadata);

  useEffect(() => {
    dispatch(retrieveBaseMetadata());
    // eslint-disable-next-line
  }, []);

  return loading ? (
    <Loader text={"Preparing data"} />
  ) : baseTablesMetadata ? (
    children
  ) : (
    <Loader />
  );
}

export default AirtableMetadata;
