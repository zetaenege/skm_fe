import styles from "./navbar.module.css";
import logo from "../../../assets/image/Logos/SKM.svg";
import home from "../../../assets/image/Icons/home.svg";
import setting from "../../../assets/image/Icons/setting.svg";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
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

      <div className={styles.actions__section}>
        {user && (
          <ul className={styles.menu}>
            <li className={styles.icons__wrapper}>
              <button
                className={styles.logout__button}
                onClick={handleHome}
                title="Home"
              >
                <img src={home} className={styles.logout__icon} alt="Home" />
              </button>
            </li>

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

              {isMenuOpen && (
                <NavDropdown
                  onClose={() => setIsMenuOpen(false)}
                  onLogout={handleLogout}
                  user={user}
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
