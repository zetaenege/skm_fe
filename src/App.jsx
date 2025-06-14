import './App.css'
import NavBar from "./components/common/navBAr/NavBar.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Login from "./components/formSteps/Login.jsx";
import ForgotPassword from "./components/formSteps/ForgotPassword.jsx";

function App() {

    return (
        <>
            <div className="container">
               <ForgotPassword/>
            </div>
        </>
    )
}

export default App
