// define the data object that used for display and upload to airtable

import convertFullNameToUsername from "../../utils/convertToUsername";

export const isRequiredFields = [
  "FullName",
  "Gender",
  "DateOfBirth",
  "RoleType",
  "Company",
];
export const isReadOnlyFields = ["Username"];
// auto generate field on client
export const clientFormulaMappedFields = [
  {
    sourceField: "FullName",
    mappedField: "Username",
    generateFunction: convertFullNameToUsername,
  },
];
export class InitialStaffDto {
  // form for Staff table
  constructor(fieldData) {
    this.FullName = fieldData?.FullName;
    this.Portrait = fieldData?.Portrait;
    this.CurriculumVitae = fieldData?.CurriculumVitae;
    this.Gender = fieldData?.Gender;
    this.DateOfBirth = fieldData?.DateOfBirth;
    this.Phone = fieldData?.Phone;
    this.PersonalEmail = fieldData?.PersonalEmail;
    this.RoleType = fieldData?.RoleType;
    this.Company = fieldData?.Company;
    this.CurrentWorkingPlace = fieldData?.CurrentWorkingPlace;
    this.ContractType = fieldData?.ContractType;
    this.WorkingType = fieldData?.WorkingType;
    this.WorkingPeriod = fieldData?.WorkingPeriod;
    this.WorkingStatus = fieldData?.WorkingStatus;
    this.StartWorkingDay = fieldData?.StartWorkingDay;
    this.MarriageStatus = fieldData?.MarriageStatus;
    this.HealthStatus = fieldData?.HealthStatus;
    this.Notes = fieldData?.Notes;
    this.Username = fieldData?.Username;
    this.Domain = fieldData?.Domain;
    this.Account = fieldData?.Account;
    this.Password = fieldData?.Password;
    this.AccountStatus = fieldData?.AccountStatus;
    this.Avatar = fieldData?.Avatar;
  }
}

const tableEditorData = {
  isReadOnlyFields,
  isRequiredFields,
  clientFormulaMappedFields,
  model: InitialStaffDto,
};

export default tableEditorData;