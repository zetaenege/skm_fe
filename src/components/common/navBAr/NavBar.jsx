import styles from './navbar.module.css';
import logoMobile from "../../../assets/elementspage/wuap_icon.svg"
import logoDesktop from "../../../assets/elementspage/wuap_logo.svg"
import logOut from "../../../assets/icons/logout-exit-circle.svg";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../../../assets/context/AuthContext.jsx";



function NavBar() {

    const {logout} = useContext(AuthContext);
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/');
    }


    return (

        <nav>
            <div className={styles.navbar__logo_wrapper}>
                <img src={logoDesktop} alt="Logo"  className={`${styles.logo} ${styles.desktop}`}/>
                <img src={logoMobile} alt="Logo Mobile"   className={`${styles.logo} ${styles.mobile}`}/>
            </div>
            <ul className={styles.menu}>
                <li className={styles.logout__wrapper}>

                    <button className={styles.logout__button} onClick={handleLogout}>
                        <img src={logOut} className={styles.logout__icon} alt="LogOut"/>
                    </button>

                </li>
            </ul>
        </nav>
    );

}

export default NavBar;
