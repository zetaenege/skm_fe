import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/common/navBAr/NavBar.jsx";
import Footer from "./components/common/footer/Footer.jsx";
import PrivateRoute from "./components/Router/PrivateRoute.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import DashboardTournament from "./pages/dashboard/DashboardTournament.jsx";
import DashboardUser from "./pages/dashboard/DashboardUser.jsx";

import SignUp from "./components/features/formSteps/SignUpForm.jsx";
import ForgotPassword from "./components/features/formSteps/ForgotPassword.jsx";
import CreatedNewPassword from "./components/features/formSteps/CreateNewPassword.jsx";
import NewTournamentForm from "./components/features/formSteps/NewTournamentForm.jsx";
import NewTeamForm from "./components/features/formSteps/NewTeamForm.jsx";
import JoinTeamForm from "./components/features/formSteps/JoinTeamForm.jsx";

function App() {
  return (
    <div className="container app-wrapper">
      <Navbar />
      <main className="main-content">
        <Routes>

          {/* Públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-new-password" element={<CreatedNewPassword />} />
          <Route path="/register" element={<Register />} />

          {/* Protegidas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute requiredAdmin={true}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/tournament/:id"
            element={
              <PrivateRoute requiredAdmin={true}>
                <DashboardTournament />
              </PrivateRoute>
            }
          />
          <Route
            path="/tournaments/new"
            element={
              <PrivateRoute requiredAdmin={true}>
                <NewTournamentForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/team/new"
            element={
              <PrivateRoute>
                <NewTeamForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/join-team"
            element={
              <PrivateRoute>
                <JoinTeamForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboarduser"
            element={
              <PrivateRoute requiredAdmin={false}>
                <DashboardUser />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;