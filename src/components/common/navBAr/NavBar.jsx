import styles from "./navbar.module.css";
import logo from "../../../assets/image/Logos/SKM.svg";
import home from "../../../assets/image/Icons/home.svg";
import setting from "../../../assets/image/Icons/setting.svg";
import logOut from "../../../assets/icons/logout-exit-circle.svg";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react"; // <-- AÑADIMOS useState AQUÍ
import { AuthContext } from "../../../assets/context/AuthContext.jsx";

function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- ESTADO PARA CONTROLAR EL MENÚ DESPLEGABLE DE CONFIGURACIÓN ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleHome() {
    if (!user) {
      navigate("/");
      return;
    }

    // Si es admin, al dashboard de control
    if (user.isAdmin) {
      navigate("/dashboard");
    }
    // Si es usuario normal, a su vista de jugador/torneo
    else {
      navigate("/dashboarduser");
    }
  }

  return (
    <nav>
      {/* ========================================== */}
      {/* E1: PERFIL (AHORA TE LLEVA A HOME)         */}
      {/* ========================================== */}
      <div
        className={styles.user__section}
        onClick={handleHome}
        style={{ cursor: "pointer" }} // <-- El cursor cambia a la manito
      >
        {user && (
          <div className={styles.profile_block}>
            <div className={styles.img__profile}>
              {user.imgProfile ? (
                <img src={user.imgProfile} alt="User Profile" />
              ) : (
                <div className={styles.user__svg_icon}></div>
              )}
            </div>
            <div className={styles.user__text}>
              <p className="text_name_small">{user.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* E2: LOGO (AHORA TE LLEVA A HOME)           */}
      {/* ========================================== */}
      <div
        className={styles.navbar__logo_wrapper}
        onClick={handleHome}
        style={{ cursor: "pointer" }} // <-- El cursor cambia a la manito
      >
        <img
          src={logo}
          alt="Logo"
          className={`${styles.logo} ${styles.desktop}`}
        />
      </div>

      {/* ========================================== */}
      {/* E3: ACCIONES (HOME Y SETTINGS DROPDOWN)    */}
      {/* ========================================== */}
      <div className={styles.actions__section}>
        {user && (
          <ul className={styles.menu}>
            <li
              className={styles.icons__wrapper}
              style={{ display: "flex", gap: "10px", alignItems: "center" }}
            >
              {/* --- BOTÓN HOME DIRECTO --- */}
              <button
                className={styles.logout__button}
                onClick={handleHome}
                title="Home"
              >
                <img src={home} className={styles.logout__icon} alt="Home" />
              </button>

              {/* --- CONTENEDOR DEL MENÚ DE CONFIGURACIÓN --- */}
              <div style={{ position: "relative", display: "inline-block" }}>
                {/* BOTÓN SETTINGS (ABRE/CIERRA EL MENÚ) */}
                <button
                  className={styles.logout__button}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  title="Settings"
                  style={{
                    backgroundColor: isMenuOpen ? "#2a2a35" : "transparent",
                    borderBottomLeftRadius: isMenuOpen ? "0" : "8px",
                    borderBottomRightRadius: isMenuOpen ? "0" : "8px",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <img
                    src={setting}
                    className={styles.logout__icon}
                    alt="Settings"
                  />
                </button>

                {/* EL CUADRO DESPLEGABLE CON "LOGOUT" */}
                {isMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: "0",
                      backgroundColor: "#2a2a35",
                      borderRadius: "8px",
                      borderTopRightRadius: "0", // Para conectarlo al botón
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                      border: "1px solid #444",
                      padding: "8px 0",
                      minWidth: "140px",
                      zIndex: 100,
                    }}
                  >
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {/* ITEM DE LOGOUT */}
                      <li
                        onClick={() => {
                          setIsMenuOpen(false); // Cerramos el menú
                          handleLogout(); // Ejecutamos logout
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 16px",
                          color: "#e94560", // Un rojo bonito
                          fontSize: "14px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        <img
                          src={logOut}
                          alt="LogOut"
                          style={{ width: "16px", height: "16px" }}
                        />
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
