// define the data object that used for display and upload to airtable

export const isRequiredFields = [];
export const isReadOnlyFields = [];
// auto generate field on client
export const clientFormulaMappedFields = [];
export class InitialCollaboratoryDto {
  // form for Role table
  constructor(fieldData) {
    this.Name = fieldData?.Name;
    this.IsCollaboratory = fieldData?.IsCollaboratory;
    this.Domain = fieldData?.Domain;
    this.Staff = fieldData?.Staff;
  }
}

const tableEditorData = {
  isReadOnlyFields,
  isRequiredFields,
  clientFormulaMappedFields,
  model: InitialCollaboratoryDto,
};

export default tableEditorData;
