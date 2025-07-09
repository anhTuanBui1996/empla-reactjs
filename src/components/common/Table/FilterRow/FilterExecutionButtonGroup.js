import {
  MdOutlineAddCircleOutline,
  MdRemoveCircleOutline,
} from "react-icons/md";

export default function FilterExecutionButtonGroup({
  classNamePrefix,
  columnIndex,
  rowIndex,
  filterRowCell,
  onAddFilterRowCell,
  onRemoveFilterRowCell,
  isFilterRowTurnOn,
}) {
  return (
    <div
      className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
      style={{
        visibility: isFilterRowTurnOn ? "visible" : "hidden",
        opacity: isFilterRowTurnOn ? 1 : 0,
        maxHeight: isFilterRowTurnOn ? "200px" : 0,
        paddingTop: isFilterRowTurnOn ? "" : 0,
        paddingBottom: isFilterRowTurnOn ? "" : 0,
        border: isFilterRowTurnOn ? "" : 0,
        overflow: "hidden",
        transition:
          "visibility .3s ease-out, opacity .3s ease-out, max-height .3s ease-out, padding .3s ease-out, border .3s ease-out",
        width: "-webkit-fill-available",
        display: "flex",
        alignItems: "center",
      }}
    >
      {filterRowCell.dataType !== "checkbox" && (
        <div
          className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
          style={{
            visibility: isFilterRowTurnOn ? "visible" : "hidden",
            opacity: isFilterRowTurnOn ? 1 : 0,
            maxHeight: isFilterRowTurnOn ? "200px" : 0,
            paddingTop: isFilterRowTurnOn ? "" : 0,
            paddingBottom: isFilterRowTurnOn ? "" : 0,
            border: isFilterRowTurnOn ? "" : 0,
            overflow: "hidden",
            transition:
              "visibility .3s ease-out, opacity .3s ease-out, max-height .3s ease-out, padding .3s ease-out, border .3s ease-out",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <MdOutlineAddCircleOutline
            className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
            style={{
              visibility: isFilterRowTurnOn ? "visible" : "hidden",
              opacity: isFilterRowTurnOn ? 1 : 0,
              maxHeight: isFilterRowTurnOn ? "200px" : 0,
              paddingTop: isFilterRowTurnOn ? "" : 0,
              paddingBottom: isFilterRowTurnOn ? "" : 0,
              border: isFilterRowTurnOn ? "" : 0,
              overflow: "hidden",
              transition:
                "visibility .3s ease-out, opacity .3s ease-out, max-height .3s ease-out, padding .3s ease-out, border .3s ease-out",
              cursor: "pointer",
              borderRadius: "50%",
            }}
            size={"20px"}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#728095";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor = "#cacbcb";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = "inherit";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "inherit";
            }}
            onClick={() =>
              onAddFilterRowCell(columnIndex, rowIndex, filterRowCell.dataType)
            }
          />
          {rowIndex > 0 && (
            <MdRemoveCircleOutline
              className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
              style={{
                visibility: isFilterRowTurnOn ? "visible" : "hidden",
                opacity: isFilterRowTurnOn ? 1 : 0,
                maxHeight: isFilterRowTurnOn ? "200px" : 0,
                paddingTop: isFilterRowTurnOn ? "" : 0,
                paddingBottom: isFilterRowTurnOn ? "" : 0,
                border: isFilterRowTurnOn ? "" : 0,
                overflow: "hidden",
                transition:
                  "visibility .3s ease-out, opacity .3s ease-out, max-height .3s ease-out, padding .3s ease-out, border .3s ease-out",
                cursor: "pointer",
                borderRadius: "50%",
              }}
              size={"20px"}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#728095";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = "#cacbcb";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor = "inherit";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "inherit";
              }}
              onClick={() => onRemoveFilterRowCell(columnIndex, rowIndex)}
            />
          )}
        </div>
      )}
    </div>
  );
}
