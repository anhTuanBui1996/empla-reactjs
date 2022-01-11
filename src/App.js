import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import Auth from "./hoc/Auth";
import WindowResizeHandler from "./hoc/WindowResizeHandler";
import Report from "./components/main/Report";
import Staff from "./components/main/Staff";
import Home from "./components/main/Home";
import Login from "./components/main/Login";
import Checkin from "./components/main/Checkin";
import Profile from "./components/main/Profile";
import Settings from "./components/main/Settings";
import Notifications from "./components/main/Notifications";
import Admin from "./components/main/Admin";
import AdminCheck from "./hoc/AdminCheck";
require("dotenv").config();

function App() {
  return (
    <WindowResizeHandler>
      <Auth>
        <AdminCheck>
          <ToastProvider autoDismiss placement="bottom-left">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/report" element={<Report />} />
              <Route path="/checkin" element={<Checkin />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </ToastProvider>
        </AdminCheck>
      </Auth>
    </WindowResizeHandler>
  );
}

export default App;
