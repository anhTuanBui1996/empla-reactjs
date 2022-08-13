// error form using on modal form
// only using for fields that can let user input

// use for StaffModal
export const initialErrorFormForStaff = {
    errStatus: false,
    isShowMsg: false,
    errMsg: {
      Staff: {
        FullName: "",
        Gender: "",
        DOB: "",
        Phone: "",
        Company: "",
      },
      Status: {
        WorkingType: "",
        WorkingStatus: "",
        StartWorkingDay: "",
      },
    },
  };
// use for RoleModal
export const initialErrorFormForRole = {
  errStatus: false,
  isShowMsg: false,
  errMsg: {
    
  },
};