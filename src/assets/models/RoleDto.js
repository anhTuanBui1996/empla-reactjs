// define the data object that used for display and upload to airtable

export const isRequiredFields = ["Name", "Gender"];
export const isReadOnlyFields = ["Username"];
// auto generate field on client
export const clientFormulaMappedFields = [];
export class InitialRoleDto {
  // form for Role table
  constructor(fieldData) {
    this.Name = fieldData?.Name;
    this.IsLeader = fieldData?.IsLeader;
    this.DatabaseAccessibility = fieldData?.DatabaseAccessibility;
    this.DepartmentName = fieldData?.DepartmentName;
    this.Description = fieldData?.Description;
    this.Create = fieldData?.Create;
    this.Read = fieldData?.Read;
    this.Update = fieldData?.Update;
    this.Delete = fieldData?.Delete;
  }
}

const tableEditorData = {
  isReadOnlyFields,
  isRequiredFields,
  clientFormulaMappedFields,
  model: InitialRoleDto,
};

export default tableEditorData;
