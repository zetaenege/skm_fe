import './App.css'
import NavBar from "./components/common/navBAr/NavBar.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Login from "./components/formSteps/Login.jsx";
import ForgotPassword from "./components/formSteps/ForgotPassword.jsx";
import CreatedNewPassword from "./components/formSteps/CreateNewPassword.jsx";
import SignUp from "./components/formSteps/SignUp.jsx";
import AccountCreated from "./components/formSteps/AccountCreated.jsx";

function App() {

    return (
        <>
            <div className="container">
               <AccountCreated />
            </div>
        </>
    )
}

export default App
