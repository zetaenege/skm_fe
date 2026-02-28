import logOut from "../../../../assets/icons/logout-exit-circle.svg";
import styles from "./floatMenu.module.css";

function NavDropdown({ onClose, onLogout }) {
  return (
    <div className={styles.dropdown__menu}>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
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
