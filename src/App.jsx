import './App.css'
import NavBar from "./components/common/navBAr/NavBar.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";

function App() {

    return (
        <>
            <div className="container">
                <NavBar/>
                <Dashboard/>
            </div>
        </>
    )
}

export default App
