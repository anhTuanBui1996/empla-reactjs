// define the data object that used for display and upload to airtable

import { retrieveAllData } from "../../services/airtable.service";
import convertFullNameToUsername from "../../utils/convertToUsername";

export const isRequiredFields = [
  "FullName",
  "Gender",
  "DateOfBirth",
  "Role",
  "Collaboratory",
  "WorkingPlace",
];

// read only field on client, that can be generate from other fields
export const isReadOnlyFields = ["Username"];
// auto generate field on client
export const clientFormulaMappedFields = [
  {
    sourceField: "FullName",
    mappedField: "Username",
    generateFunction: async (fullName) => {
      let convertedUsername = convertFullNameToUsername(fullName);
      let resultUsername = await retrieveAllData(
        "Staff",
        `NOT(SEARCH("${convertedUsername}", {Username}) = "") `
      );
      console.log(resultUsername);
    },
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
    this.Collaboratory = fieldData?.Collaboratory;
    this.Role = fieldData?.Role;
    this.Checkin = fieldData?.Checkin;
    this.WorkingPlace = fieldData?.WorkingPlace;
    this["Tasks (AssignedTo)"] = fieldData
      ? fieldData["Tasks (AssignedTo)"]
      : undefined;
    this["Tasks (Supervisor)"] = fieldData
      ? fieldData["Tasks (Supervisor)"]
      : undefined;
    this.Tokens = fieldData?.Tokens;
  }
}

const tableEditorData = {
  isReadOnlyFields,
  isRequiredFields,
  clientFormulaMappedFields,
  model: InitialStaffDto,
};

export default tableEditorData;
