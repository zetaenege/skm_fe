import Login from '../../pages/Login.jsx';
import Dashboard from '../../pages/dashboard/Dashboard.jsx';
import DashboardTournament from '../../pages/dashboard/DashboardTournament.jsx';
import NewTournamentForm from '../features/formSteps/NewTournamentForm.jsx';
import NewTeamForm from '../features/formSteps/NewTeamForm.jsx';
import DashboardUser from '../../pages/dashboard/DashboardUser.jsx';
import SignUp from '../../components/features/formSteps/SignUpForm.jsx';
import ForgotPassword from '../../components/features/formSteps/ForgotPassword.jsx';
import CreatedNewPassword from '../../components/features/formSteps/CreateNewPassword.jsx';
import Register from '../../pages/Register.jsx';
import {Route, Routes} from "react-router-dom";
import PrivateRoute from "./PrivateRoute.jsx";
import JoinTeamForm from "../features/formSteps/JoinTeamForm.jsx";

const AppRoutes = () => {


    return (
        <>
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

    </>
    );
};

export default AppRoutes;