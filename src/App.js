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
import Database from "./components/main/Database";
import useGeolocation from "./components/hooks/useGeolocation";
import "react-grid-layout/css/styles.css";
import "react-grid-layout/node_modules/react-resizable/css/styles.css";
import Clients from "./components/main/Clients";
import Projects from "./components/main/Projects";
import Teams from "./components/main/Teams";
import Role from "./components/main/Role";
import Department from "./components/main/Department";
import WorkingPlace from "./components/main/WorkingPlace";
import Collaboratory from "./components/main/Collaboratory";
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
          <AdminCheck>
            <Routes>
              <Route path="/login" element={<Login />} />

              {/**
               * Condition routes (sensity content will be defined in components)
               */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/role" element={<Role />} />
              <Route path="/department" element={<Department />} />
              <Route path="/workingplace" element={<WorkingPlace />} />
              <Route path="/collaboratory" element={<Collaboratory />} />

              {/**
               * Private routes
               */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/database" element={<Database />} />
              <Route path="/clients" element={<Clients />} />

              {/**
               * Public routes
               */}
              <Route path="/report" element={<Report />} />
              <Route path="/checkin" element={<Checkin />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </AdminCheck>
        </Auth>
      </ToastProvider>
    </WindowResizeHandler>
  );
}

export default App;
