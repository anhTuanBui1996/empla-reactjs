import unknown from "../images/UNKNOWN-thumbnail.svg";
import pdf from "../images/PDF-thumbnail.png";
import msExcel from "../images/MSEXCEL-thumbnail.png";
import msWord from "../images/MSWORD-thumbnail.png";

export const thumbnailForType = {
  unknown: unknown,
  "application/pdf": pdf,
  "application/vnd.ms-excel": msExcel,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": msExcel,
  "application/msword": msWord,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    msWord,
};
