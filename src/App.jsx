import './App.css'
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import ForgotPassword from "./components/features/formSteps/ForgotPassword.jsx";
import CreatedNewPassword from "./components/features/formSteps/CreateNewPassword.jsx";
import SignUp from "./components/features/formSteps/SignUpForm.jsx";
import AccountCreated from "./components/features/formSteps/AccountCreated.jsx";
import {Route, Routes} from "react-router-dom";
import Login from "./pages/Login.jsx";
import NavBar from "./components/common/navBAr/NavBar.jsx";
import DashboardUser from "./pages/dashboard/DashboardUser.jsx";

function App() {

    return (
        <>
            <div className="container">
                <NavBar/>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/dashboarduser" element={<DashboardUser/>}/>
                    <Route path="/signup" element={<SignUp/>}/>
                    <Route path="/forgot-password" element={<ForgotPassword/>}/>
                    <Route path="/create-new-password" element={<CreatedNewPassword/>}/>
                    <Route path="/account-created" element={<AccountCreated/>}/>
                </Routes>
            </div>
        </>
    );


}

export default App
