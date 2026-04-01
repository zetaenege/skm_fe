import styles from "./navbar.module.css";
import logo from "../../../assets/image/Logos/SKM.svg";
import home from "../../../assets/image/Icons/home.svg";
import setting from "../../../assets/image/Icons/setting.svg";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react"; // <-- AÑADIMOS useState AQUÍ
import { AuthContext } from "../../../assets/context/AuthContext.jsx";
import NavDropdown from "../../features/management/floatMenu/NavDropdown.jsx";

function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
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

    if (user.isAdmin) {
      navigate("/dashboard");
    } else {
      navigate("/dashboarduser");
    }
  }

  return (
    <nav>
      {/* ART -  01 - FOTO EN NAAM */}
      <div
        className={styles.user__section}
        onClick={handleHome}
        style={{ cursor: "pointer" }}
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

      {/* ART - 02 - LOGO */}

      <div
        className={styles.navbar__logo_wrapper}
        onClick={handleHome}
        style={{ cursor: "pointer" }}
      >
        <img
          src={logo}
          alt="Logo"
          className={`${styles.logo} ${styles.desktop}`}
        />
      </div>

      {/* ART - 03 - MENU CONTROL */}

      <div className={styles.actions__section}>
        {user && (
          <ul className={styles.menu}>
            {/* ICON HOME */}
            <li className={styles.icons__wrapper}>
              <button
                className={styles.logout__button}
                onClick={handleHome}
                title="Home"
              >
                <img src={home} className={styles.logout__icon} alt="Home" />
              </button>
            </li>

            {/* ICON CONFIG */}
            <li className={styles.icons__wrapper}>
              <button
                className={styles.logout__button}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                title="Settings"
              >
                <img
                  src={setting}
                  className={styles.logout__icon}
                  alt="Settings"
                />
              </button>

              {/* FLOAT MENU" */}
              {isMenuOpen && (
                <NavDropdown
                  onClose={() => setIsMenuOpen(false)}
                  onLogout={handleLogout}
                  user={user} // Pasamos el usuario actual
                />
              )}
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
