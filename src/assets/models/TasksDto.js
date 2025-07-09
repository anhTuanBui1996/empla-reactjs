// define the data object that used for display and upload to airtable

export const isRequiredFields = [];
export const isReadOnlyFields = [];
// auto generate field on client
export const clientFormulaMappedFields = [];
export class InitialTasksDto {
  // form for Role table
  constructor(fieldData) {
    this.Name = fieldData?.Name;
    this.Description = fieldData?.Description;
    this.Status = fieldData?.Status;
    this.StartDate = fieldData?.StartDate;
    this.FinishDate = fieldData?.FinishDate;
    this.AssignedTo = fieldData?.AssignedTo;
    this.Staff_AssignedTo = fieldData?.Staff_AssignedTo;
    this.StaffAccount_AssignedTo = fieldData?.StaffAccount_AssignedTo;
    this.Supervisor = fieldData?.Supervisor;
    this.Staff_Supervisor = fieldData?.Staff_Supervisor;
    this.StaffAccount_Supervisor = fieldData?.StaffAccount_Supervisor;
  }
}

const tableEditorData = {
  isReadOnlyFields,
  isRequiredFields,
  clientFormulaMappedFields,
  model: InitialTasksDto,
};

export default tableEditorData;
