import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import Auth from "./hoc/Auth";
import WindowResizeHandler from "./hoc/WindowResizeHandler";
import Tasks from "./components/main/Tasks";
import Staff from "./components/main/Staff";
import Home from "./components/main/Home";
import Login from "./components/main/Login";
import Checkin from "./components/main/Checkin";
import Profile from "./components/main/Profile";
import Settings from "./components/main/Settings";
import Notifications from "./components/main/Notifications";
import AdminCheck from "./hoc/AdminCheck";
import useGeolocation from "./components/hooks/useGeolocation";
import Role from "./components/main/Role";
import WorkingPlace from "./components/main/WorkingPlace";
import Collaboratory from "./components/main/Collaboratory";
import Nomatch from "./components/main/Nomatch";
import AirtableMetadata from "./hoc/AirtableMetadata";
require("dotenv").config();

function App() {
  useGeolocation();
  return (
    <WindowResizeHandler>
      <ToastProvider
        autoDismiss
        placement="bottom-left"
        autoDismissTimeout={8000}
      >
        <Auth>
          <AirtableMetadata>
            <AdminCheck>
              <Routes>
                <Route path="/login" element={<Login />} />

                {/**
                 * Condition routes (sensity content will be defined in components)
                 */}
                <Route path="/staff" element={<Staff />} />

                {/**
                 * Private routes
                 */}
                <Route path="/role" element={<Role />} />
                <Route path="/workingplace" element={<WorkingPlace />} />
                <Route path="/collaboratory" element={<Collaboratory />} />

                {/**
                 * Public routes
                 */}
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/checkin" element={<Checkin />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/" element={<Home />} />

                {/* Nomatch route */}
                <Route path="*" element={<Nomatch />} />
              </Routes>
            </AdminCheck>
          </AirtableMetadata>
        </Auth>
      </ToastProvider>
    </WindowResizeHandler>
  );
}

export default App;
