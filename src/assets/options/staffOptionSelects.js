// all the input form below must have this 2 properties
// (name, data-table)

// define the select list use for dropdown form control
// empty select lists have to retrieve data from Airtable
export const optionList = {
  Staff: {
    Gender: {
      fromTable: "Staff",
      list: [
        { "data-table": "Staff", label: "Nam", value: "Nam", name: "Gender" },
        { "data-table": "Staff", label: "Nữ", value: "Nữ", name: "Gender" },
      ],
    },
    Company: {
      fromTable: "Collaboratory",
      displayedField: "Name",
      list: [] /* { "data-table": "", value: "", label: "", name: "" } */,
    },
    CurrentWorkingPlace: {
      fromTable: "WorkingPlace",
      displayedField: "Name",
      list: [] /* { "data-table": "", value: "", label: "", name: "" } */,
    },
    RoleType: {
      fromTable: "Role",
      displayedField: "Name",
      list: [] /* { "data-table": "", value: "", label: "", name: "" } */,
    },
    ContractType: {
      fromTable: "Staff",
      list: [
        {
          "data-table": "Staff",
          label: "Indefinite",
          value: "Indefinite",
          name: "WorkingPeriod",
        },
        {
          "data-table": "Staff",
          label: "Duration",
          value: "Duration",
          name: "WorkingPeriod",
        },
        {
          "data-table": "Staff",
          label: "Terminated",
          value: "Terminated",
          name: "WorkingPeriod",
        },
      ],
    },
    WorkingType: {
      fromTable: "Staff",
      list: [
        {
          "data-table": "Staff",
          label: "Intern",
          value: "Intern",
          name: "WorkingType",
        },
        {
          "data-table": "Staff",
          label: "Probation",
          value: "Probation",
          name: "WorkingType",
        },
        {
          "data-table": "Staff",
          label: "Official",
          value: "Official",
          name: "WorkingType",
        },
      ],
    },
    WorkingPeriod: {
      fromTable: "Staff",
      list: [
        {
          "data-table": "Staff",
          label: "Full-time",
          value: "Full-time",
          name: "WorkingPeriod",
        },
        {
          "data-table": "Staff",
          label: "Part-time",
          value: "Part-time",
          name: "WorkingPeriod",
        },
      ],
    },
    WorkingStatus: {
      fromTable: "Staff",
      list: [
        {
          "data-table": "Staff",
          label: "Working from home",
          value: "Working from home",
          name: "WorkingStatus",
        },
        {
          "data-table": "Staff",
          label: "Working in department",
          value: "Working in department",
          name: "WorkingStatus",
        },
        {
          "data-table": "Staff",
          label: "On-site with client",
          value: "On-site with client",
          name: "WorkingStatus",
        },
        {
          "data-table": "Staff",
          label: "Leaving",
          value: "Leaving",
          name: "WorkingStatus",
        },
      ],
    },
    MarriageStatus: {
      fromTable: "Staff",
      list: [
        {
          "data-table": "Staff",
          label: "Married",
          value: "Married",
          name: "MarriageStatus",
        },
        {
          "data-table": "Staff",
          label: "Single",
          value: "Single",
          name: "MarriageStatus",
        },
      ],
    },
    HealthStatus: {
      fromTable: "Staff",
      list: [
        {
          "data-table": "Staff",
          label: "Normally",
          value: "Normally",
          name: "HealthStatus",
        },
        {
          "data-table": "Staff",
          label: "Having diseases",
          value: "Having diseases",
          name: "HealthStatus",
        },
        {
          "data-table": "Staff",
          label: "Pregnants",
          value: "Pregnants",
          name: "HealthStatus",
        },
        {
          "data-table": "Staff",
          label: "Taking care babies",
          value: "Taking care babies",
          name: "HealthStatus",
        },
        {
          "data-table": "Staff",
          label: "Taking care victims",
          value: "Taking care victims",
          name: "HealthStatus",
        },
      ],
    },
    Domain: {
      fromTable: "Collaboratory",
      list: [],
    },
    AccountStatus: {
      fromTable: "Staff",
      list: [
        {
          "data-table": "Staff",
          label: "Enabled",
          value: "Enabled",
          name: "AccountStatus",
        },
        {
          "data-table": "Staff",
          label: "Disabled",
          value: "Disabled",
          name: "AccountStatus",
        },
      ],
    },
  },
};
