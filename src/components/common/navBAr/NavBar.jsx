import styles from './navbar.module.css';
import logo from "../../../assets/image/Logos/SKM.svg"
import home from "../../../assets/image/Icons/home.svg";
import setting from "../../../assets/image/Icons/setting.svg";
import logOut from "../../../assets/icons/logout-exit-circle.svg";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../../../assets/context/AuthContext.jsx";


function NavBar() {

    const {user, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/');
    }


    function handleHome() {
        if (!user) {
            navigate('/');
            return;
        }

        // Si es admin, al dashboard de control
        if (user.isAdmin) {
            navigate('/dashboard');
        }
        // Si es usuario normal, a su vista de jugador/torneo
        else {
            navigate('/dashboarduser');
        }
    }




    return (

        <nav>
            {/*E1*/}
            <div className={styles.user__section}>
                {user && (
                    <div className={styles.profile_block}>
                        <div className={styles.img__profile}>
                            {user.imgProfile ? (
                                // Si el usuario tiene foto real, usamos <img>
                                <img src={user.imgProfile} alt="User Profile"/>
                            ) : (
                                // Si no tiene foto, usamos el SVG como máscara para darle color
                                <div className={styles.user__svg_icon}></div>
                            )}
                        </div>
                        <div className={styles.user__text}>
                            <p className="text_name_small">{user.name}</p>
                        </div>
                    </div>
                )}
            </div>
            {/*E2*/}
            <div className={styles.navbar__logo_wrapper}>
                <img src={logo} alt="Logo" className={`${styles.logo} ${styles.desktop}`}/>
            </div>
            {/*E3*/}

            <div className={styles.actions__section}>
                {user && (
                    <ul className={styles.menu}>
                        <li className={styles.icons__wrapper}>
                            <button className={styles.logout__button} onClick={handleHome} title="Logout">
                                <img src={home} className={styles.logout__icon} alt="LogOut"/>
                            </button>
                            <button className={styles.logout__button} onClick={handleLogout} title="Logout">
                                <img src={logOut} className={styles.logout__icon} alt="LogOut"/>
                            </button>
                            <button className={styles.logout__button} onClick={handleLogout} title="Logout">
                                <img src={setting} className={styles.logout__icon} alt="LogOut"/>
                            </button>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );

}

export default NavBar;
