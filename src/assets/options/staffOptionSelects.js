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
        list: [] /* { "data-table": "", value: "", label: "", name: "" } */,
      },
      CurrentWorkingPlace: {
        fromTable: "WorkingPlace",
        list: [] /* { "data-table": "", value: "", label: "", name: "" } */,
      },
      RoleType: {
        fromTable: "Role",
        list: [] /* { "data-table": "", value: "", label: "", name: "" } */,
      },
    },
    Status: {
      WorkingType: {
        fromTable: "Status",
        list: [
          {
            "data-table": "Status",
            label: "Intern",
            value: "Intern",
            name: "WorkingType",
          },
          {
            "data-table": "Status",
            label: "Probation",
            value: "Probation",
            name: "WorkingType",
          },
          {
            "data-table": "Status",
            label: "Official",
            value: "Official",
            name: "WorkingType",
          },
        ],
      },
      WorkingStatus: {
        fromTable: "Status",
        list: [
          {
            "data-table": "Status",
            label: "Working from home",
            value: "Working from home",
            name: "WorkingStatus",
          },
          {
            "data-table": "Status",
            label: "Working in department",
            value: "Working in department",
            name: "WorkingStatus",
          },
          {
            "data-table": "Status",
            label: "On-site with client",
            value: "On-site with client",
            name: "WorkingStatus",
          },
          {
            "data-table": "Status",
            label: "Leaving",
            value: "Leaving",
            name: "WorkingStatus",
          },
        ],
      },
      MarriageStatus: {
        fromTable: "Status",
        list: [
          {
            "data-table": "Status",
            label: "Maried",
            value: "Maried",
            name: "MarriageStatus",
          },
          {
            "data-table": "Status",
            label: "Single",
            value: "Single",
            name: "MarriageStatus",
          },
        ],
      },
      HealthStatus: {
        fromTable: "Status",
        list: [
          {
            "data-table": "Status",
            label: "Normally",
            value: "Normally",
            name: "HealthStatus",
          },
          {
            "data-table": "Status",
            label: "Having diseases",
            value: "Having diseases",
            name: "HealthStatus",
          },
          {
            "data-table": "Status",
            label: "Pregnants",
            value: "Pregnants",
            name: "HealthStatus",
          },
          {
            "data-table": "Status",
            label: "Taking care babies",
            value: "Taking care babies",
            name: "HealthStatus",
          },
          {
            "data-table": "Status",
            label: "Taking care victims",
            value: "Taking care victims",
            name: "HealthStatus",
          },
        ],
      },
      Covid19Vaccinated: {
        fromTable: "Status",
        list: [
          {
            "data-table": "Status",
            label: "Not vaccinated",
            value: "Not vaccinated",
            name: "Covid19Vaccinated",
          },
          {
            "data-table": "Status",
            label: "1 time vaccinated",
            value: "1 time vaccinated",
            name: "Covid19Vaccinated",
          },
          {
            "data-table": "Status",
            label: "2 time vaccinated",
            value: "2 time vaccinated",
            name: "Covid19Vaccinated",
          },
        ],
      },
      Covid19VaccineType: {
        fromTable: "Status",
        list: [
          {
            "data-table": "Status",
            label: "AZD1222 (Astra Zeneca)",
            value: "AZD1222 (Astra Zeneca)",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Sputnik-V (Gamalaya)",
            value: "Sputnik-V (Gamalaya)",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Vero-Cell (Sinopharm)",
            value: "Vero-Cell (Sinopharm)",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Corminaty (Pfizer BioNTect)",
            value: "Corminaty (Pfizer BioNTect)",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Spikevax (Covid-19 vaccine Mordena)",
            value: "Spikevax (Covid-19 vaccine Mordena)",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Covid-19 vaccine Janssen",
            value: "Covid-19 vaccine Janssen",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Vaccine Hayat-Vax",
            value: "Vaccine Hayat-Vax",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Vaccine Abdala (AICA)",
            value: "Vaccine Abdala (AICA)",
            name: "Covid19VaccineType",
          },
        ],
      },
    },
    Account: {
      Domain: {
        fromTable: "Collaboratory",
        list: [],
      },
      AccountStatus: {
        fromTable: "Account",
        list: [
          {
            "data-table": "Account",
            label: "Active",
            value: "Active",
            name: "AccountStatus",
          },
          {
            "data-table": "Account",
            label: "Inactive",
            value: "Inactive",
            name: "AccountStatus",
          },
        ],
      },
    },
  };
  