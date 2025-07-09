import Col from "../../../layout/Col";
import Row from "../../../layout/Row";
import CustomSwitch from "../../CustomSwitch";
import Select from "react-select";

export default function SortingActivationToggle({
  classNamePrefix,
  tableId,
  sortingArr,
  fieldList,
  selectingSorting,
  onChangeSelectingSorting,
  isSortingTurnOn,
  onToggle,
}) {
  return (
    <Row className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}>
      <Col
        columnSize={["12"]}
        className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
      >
        <div
          className={`${
            classNamePrefix ? `${classNamePrefix} ` : ""
          }form-group d-flex flex-nowrap justify-content-between align-items-center mb-0`}
          style={{ gap: "10px" }}
        >
          <div
            className={`${classNamePrefix ? `${classNamePrefix} ` : ""}d-flex`}
          >
            <label
              className={`${classNamePrefix ? `${classNamePrefix} ` : ""}mb-0`}
              htmlFor={`go-to-sorting-field_${tableId}`}
              style={{ whiteSpace: "nowrap" }}
            >
              Sorting list
            </label>
            <CustomSwitch
              id={"sorting-toggle"}
              className={`${classNamePrefix ? `${classNamePrefix} ` : ""}ml-2`}
              inputValue={isSortingTurnOn}
              onSwitchChange={onToggle}
            />
          </div>
          <Select
            inputId={`go-to-sorting-field_${tableId}`}
            placeholder="Order list..."
            noOptionsMessage={() => <span>No sorted field</span>}
            classNamePrefix={`${
              classNamePrefix ? `${classNamePrefix} ` : ""
            }ml-4`}
            options={sortingArr.map((s, i) => ({
              label: `${i + 1}: ${fieldList[s.index]} (${s.fieldSort})`,
              value: s.index,
            }))}
            value={selectingSorting}
            onChange={onChangeSelectingSorting}
          />
        </div>
      </Col>
    </Row>
  );
}
