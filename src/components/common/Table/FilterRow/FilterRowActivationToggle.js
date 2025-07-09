import Col from "../../../layout/Col";
import Row from "../../../layout/Row";
import CustomSwitch from "../../CustomSwitch";

export default function FilterRowActivationToggle({
  classNamePrefix,
  tableId,
  onToggle,
  isFilterRowTurnOn,
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
          <label
            className={`${classNamePrefix ? `${classNamePrefix} ` : ""}mb-0`}
            htmlFor={`go-to-filter-row_${tableId}`}
            style={{ whiteSpace: "nowrap" }}
          >
            Filter Row
          </label>
          <CustomSwitch
            id={"filter-row-toggle"}
            className={`${classNamePrefix ? `${classNamePrefix} ` : ""}ml-2`}
            inputValue={isFilterRowTurnOn}
            onSwitchChange={onToggle}
          />
        </div>
      </Col>
    </Row>
  );
}
