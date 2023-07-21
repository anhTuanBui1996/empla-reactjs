import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewRecord,
  deleteRecordWhere,
  retrieveAllData,
} from "../services/airtable.service";
import { getLocalUser } from "../services/localStorage.service";

const initialState = {
  lastRoute: "",
  loading: false,
  userCredential: getLocalUser(),
  userRole: null,
  newToken: null,
  isTokenValid: false,
  isLoginValid: false,
  userInfo: null,
  error: {
    status: false,
    type: "",
    message: "",
  },
};

export const retrieveUserInfoWithPassword = createAsyncThunk(
  "user/retrieveWithPassword",
  async ({ username, password }) => {
    const res = await retrieveAllData(
      "Staff",
      `AND({Account} = "${username}", {Password} = "${password}")`
    );
    return res;
  }
);

export const retrieveUserInfoWithToken = createAsyncThunk(
  "user/retrieveWithToken",
  async ({ account, token }) => {
    const res = await retrieveAllData(
      "Tokens",
      `AND({Account} = "${account}", {Token} = "${token}")`
    );
    return res;
  }
);

export const retrieveUserInfo = createAsyncThunk(
  "user/retrieve",
  async (account) => {
    const res = await retrieveAllData("Staff", `{Account} = "${account}"`);
    return res;
  }
);

export const createNewLoginToken = createAsyncThunk(
  "user/createLoginToken",
  async (token) => {
    const res = await createNewRecord("Tokens", token);
    return res;
  }
);

export const retrieveUserRole = createAsyncThunk(
  "user/retrieveUserRole",
  async () => {
    const res = await retrieveAllData("Role");
    return res;
  }
);

export const removeToken = createAsyncThunk(
  "user/removeToken",
  async (token) => {
    const res = await deleteRecordWhere("Tokens", `{Token} = "${token}"`);
    return res;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLastRoute: (state, action) => {
      state.lastRoute = action.payload;
    },
    setUserCredential: (state, action) => {
      state.userCredential = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setNewToken: (state, action) => {
      state.newToken = action.payload;
    },
    setIsTokenValid: (state, action) => {
      state.isTokenValid = action.payload;
    },
    setIsLoginValid: (state, action) => {
      state.isLoginValid = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetUserSlice: (state) => {
      state.loading = false;
      state.userCredential = getLocalUser();
      state.newToken = null;
      state.isTokenValid = false;
      state.isLoginValid = false;
      state.userInfo = null;
      state.error.message = "";
      state.error.status = false;
      state.error.type = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveUserInfoWithPassword.pending, (state, action) => {
        state.userInfo = action.payload;
        state.loading = true;
        state.isLoginValid = false;
        state.error.message = "";
        state.error.status = false;
        state.error.type = "";
      })
      .addCase(retrieveUserInfoWithPassword.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          if (action.payload.length > 0) {
            state.userInfo = action.payload[0];
            state.isLoginValid = true;
            state.error.message = "";
            state.error.status = false;
            state.error.type = "";
          } else {
            state.userInfo = null;
            state.isLoginValid = false;
            state.error.message = "Username or password is incorrect!";
            state.error.status = true;
            state.error.type = "username";
          }
        } else {
          state.userInfo = null;
          state.isLoginValid = false;
          state.error.message = "Username or password is incorrect!";
          state.error.status = true;
          state.error.type = "username";
        }
      })
      .addCase(retrieveUserInfoWithPassword.rejected, (state, action) => {
        state.userInfo = null;
        state.loading = false;
        state.error.message = "Login failed, please try again!";
        state.error.status = true;
        state.error.type = "request";
      })
      .addCase(retrieveUserInfoWithToken.pending, (state, action) => {
        state.userInfo = action.payload;
        state.loading = true;
        state.isTokenValid = false;
        state.error.message = "";
        state.error.status = false;
        state.error.type = "";
      })
      .addCase(retrieveUserInfoWithToken.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          if (action.payload.length > 0) {
            state.userInfo = null;
            state.loading = true;
            state.isTokenValid = true;
            state.error.message = "";
            state.error.status = false;
            state.error.type = "";
          }
        } else {
          state.userInfo = null;
          state.loading = false;
          state.isTokenValid = false;
          state.error.message = "Login failed, please try again!";
          state.error.status = true;
          state.error.type = "request";
        }
      })
      .addCase(retrieveUserInfoWithToken.rejected, (state, action) => {
        state.userInfo = null;
        state.loading = false;
        state.isTokenValid = false;
        state.error.message = "Login failed, please try again!";
        state.error.status = true;
        state.error.type = "request";
      })
      .addCase(retrieveUserInfo.pending, (state, action) => {
        state.userInfo = null;
        state.loading = true;
        state.error.message = "";
        state.error.status = false;
        state.error.type = "";
      })
      .addCase(retrieveUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload[0];
        state.loading = true;
        state.error.message = "";
        state.error.status = false;
        state.error.type = "";
      })
      .addCase(retrieveUserInfo.rejected, (state, action) => {
        state.userInfo = null;
        state.loading = true;
        state.error.message = "";
        state.error.status = false;
        state.error.type = "Retrieve user information failed!";
      })
      .addCase(createNewLoginToken.pending, (state, action) => {
        state.newToken = null;
        state.loading = true;
        state.error.message = "";
        state.error.status = false;
        state.error.type = "";
      })
      .addCase(createNewLoginToken.fulfilled, (state, action) => {
        state.newToken = action.payload.fields.Token;
        state.loading = false;
        state.error.message = "";
        state.error.status = false;
        state.error.type = "";
      })
      .addCase(createNewLoginToken.rejected, (state, action) => {
        state.newToken = null;
        state.loading = false;
        state.error.message = "The new login token creation failed!";
        state.error.status = true;
        state.error.type = "token";
      })
      .addCase(removeToken.pending, (state, action) => {
        state.loading = true;
        state.error.message = "";
        state.error.status = false;
        state.error.type = "";
      })
      .addCase(removeToken.fulfilled, (state, action) => {
        state.loading = false;
        state.newToken = null;
        state.isTokenValid = false;
        state.error.message = "";
        state.error.status = false;
        state.error.type = "";
      })
      .addCase(removeToken.rejected, (state, action) => {
        state.loading = false;
        state.error.message = "Remove existing token failed!";
        state.error.status = true;
        state.error.type = "token";
      });
  },
});

export const {
  setLastRoute,
  setUserCredential,
  setUserInfo,
  setNewToken,
  setIsTokenValid,
  setIsLoginValid,
  setLoading,
  setError,
  resetUserSlice,
} = userSlice.actions;
export const selectLastRoute = (state) => state.user.lastRoute;
export const selectUserCredential = (state) => state.user.userCredential;
export const selectNewToken = (state) => state.user.newToken;
export const selectIsTokenValid = (state) => state.user.isTokenValid;
export const selectIsLoginValid = (state) => state.user.isLoginValid;
export const selectUserInfo = (state) => state.user.userInfo;
export const selectLoading = (state) => state.user.loading;
export const selectError = (state) => state.user.error;

export default userSlice.reducer;
