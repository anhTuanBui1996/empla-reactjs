import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

export default function SortingHeaderArrowToggle({
  classNamePrefix,
  fieldColumnIndex,
  sortingArr,
  onSortingRecords,
  isSortingTurnOn,
}) {
  return (
    <div
      className={`${
        classNamePrefix ? `${classNamePrefix} ` : ""
      }position-absolute d-inline-block ml-2`}
      style={{
        cursor: "pointer",
        width: "30px",
        right: isSortingTurnOn ? "12px" : "30px",
        visibility: isSortingTurnOn ? "visible" : "hidden",
        opacity: isSortingTurnOn ? 1 : 0,
        transition:
          "visibility .3s ease-out, opacity .3s ease-out, right .3s ease-out",
      }}
      onClick={() => onSortingRecords(fieldColumnIndex)}
    >
      <MdKeyboardArrowUp
        className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
        style={{
          position: "absolute",
          top: -7,
          border: "1px solid #95aac9",
          borderTopLeftRadius: "3px",
          borderTopRightRadius: "3px",
          backgroundColor:
            sortingArr.find((s) => s.index === fieldColumnIndex)?.fieldSort ===
            "ascending"
              ? "#2c7be5"
              : "",
        }}
        size={15}
        color={
          sortingArr.find((s) => s.index === fieldColumnIndex)?.fieldSort ===
          "ascending"
            ? "#fff"
            : ""
        }
      />
      <MdKeyboardArrowDown
        className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
        style={{
          position: "absolute",
          top: 7,
          border: "1px solid #95aac9",
          borderBottomLeftRadius: "3px",
          borderBottomRightRadius: "3px",
          backgroundColor:
            sortingArr.find((s) => s.index === fieldColumnIndex)?.fieldSort ===
            "descending"
              ? "#2c7be5"
              : "",
        }}
        size={15}
        color={
          sortingArr.find((s) => s.index === fieldColumnIndex)?.fieldSort ===
          "descending"
            ? "#fff"
            : ""
        }
      />
    </div>
  );
}
