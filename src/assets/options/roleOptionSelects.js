// all the input form below must have this 2 properties
// (name, data-table)

// define the select list use for dropdown form control
// empty select lists have to retrieve data from Airtable
export const optionList = {
    Role: {
      Gender: {
        fromTable: "Role",
        list: [
          { "data-table": "Role", label: "Nam", value: "Nam", name: "Gender" },
          { "data-table": "Role", label: "Nữ", value: "Nữ", name: "Gender" },
        ],
      },
    },
  };
  
  