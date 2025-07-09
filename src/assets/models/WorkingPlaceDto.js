// define the data object that used for display and upload to airtable

export const isRequiredFields = ["Name", "Gender"];
export const isReadOnlyFields = ["Username"];
// auto generate field on client
export const clientFormulaMappedFields = [];
export class InitialWorkingPlaceDto {
  // form for Role table
  constructor(fieldData) {
    this.Name = fieldData?.Name;
    this.Address = fieldData?.Address;
    this.District = fieldData?.District;
    this.City = fieldData?.City;
    this.Country = fieldData?.Country;
    this.Staff = fieldData?.Staff;
  }
}

const tableEditorData = {
  isReadOnlyFields,
  isRequiredFields,
  clientFormulaMappedFields,
  model: InitialWorkingPlaceDto,
};

export default tableEditorData;
