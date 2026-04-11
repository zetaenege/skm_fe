import React from "react";
import AppRoutes from "./components/Router/AppRoutes.jsx";
import Navbar from "./components/common/navBar/NavBar.jsx";
import Footer from "./components/common/footer/Footer.jsx";

function App() {
  return (
    <div className="container app-wrapper">
      <Navbar />
      <main className="main-content">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
