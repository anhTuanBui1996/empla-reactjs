import { staffSliceForTableEditor } from "../../../features/tables/staffSlice";
import { roleSliceForTableEditor } from "../../../features/tables/roleSlice";
import { workingPlaceSliceForTableEditor } from "../../../features/tables/workingPlaceSlice";
import { collaboratorySliceForTableEditor } from "../../../features/tables/collaboratorySlice";
import { tasksSliceForTableEditor } from "../../../features/tables/tasksSlice";

const slice = {
  Staff: staffSliceForTableEditor,
  Role: roleSliceForTableEditor,
  WorkingPlace: workingPlaceSliceForTableEditor,
  Collaboratory: collaboratorySliceForTableEditor,
  Tasks: tasksSliceForTableEditor,
};

export default slice;
