import './App.css'
import AppRoutes from "./components/Router/AppRoutes.jsx";
import {AuthContext} from "./assets/context/AuthContext.jsx";
import {useContext} from "react";
import Navbar from "./components/common/navBar/NavBar.jsx";
import Footer from "./components/common/footer/Footer.jsx";




function App() {

    const { user } = useContext(AuthContext);

    return (

            <div className="container">
                {user && <Navbar />}
                <AppRoutes/>
                <Footer />
            </div>
    );


}

export default App;