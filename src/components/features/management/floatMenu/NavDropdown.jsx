import logOut from "../../../../assets/icons/logout-exit-circle.svg";
import styles from "./floatMenu.module.css";
import EditMenu from "./EditMenu.jsx";
import EditMenuTour from "./EditMenuTour.jsx";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react"; // <-- AÑADIDOS HOOKS

function NavDropdown({ onClose, onLogout, user }) {
  const location = useLocation();
  const isTournamentDashboard = location.pathname.includes("tournament");

  const dropdownRef = useRef(null);
  // Estado para saber qué formulario está abierto: null | "user" | "tournament"
  const [activeForm, setActiveForm] = useState(null);

  // Detectar clic fuera del componente para cerrarlo
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      className={`${styles.dropdown__menu} animate__dropdown_enter`}
      ref={dropdownRef}
    >
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li>
          <EditMenu
            type={user?.isAdmin ? "admin" : "user"}
            data={user}
            isEditingMode={activeForm === "user"} // Recibe si debe estar abierto
            onOpenForm={() => setActiveForm("user")} // Avisa que se abrió
            onCloseForm={() => setActiveForm(null)} // Avisa que se cerró
          />
        </li>

        {user?.isAdmin && isTournamentDashboard && (
          <li>
            <EditMenuTour
              isEditingMode={activeForm === "tournament"} // Recibe si debe estar abierto
              onOpenForm={() => setActiveForm("tournament")} // Avisa que se abrió
              onCloseForm={() => setActiveForm(null)} // Avisa que se cerró
            />
          </li>
        )}

        <li
          onClick={() => {
            onClose();
            onLogout();
          }}
          className={styles.dropdown__item}
        >
          <img src={logOut} alt="LogOut" className={styles.dropdown__icon} />
          <p>Logout</p>
        </li>
      </ul>
    </div>
  );
}

export default NavDropdown;
