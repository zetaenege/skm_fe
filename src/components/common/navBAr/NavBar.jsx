import styles from './navbar.module.css';


function NavBar() {

    return (

            <nav>


                <img src="https://via.placeholder.com/150" alt="Logo" className="logo desktop"/>
                <img src="https://via.placeholder.com/100" alt="Logo Mobile" className="logo mobile"/>

                <ul className="menu">
                    <li className="logout-wrapper">
                        <button className="logout-button">
                            <img src="https://via.placeholder.com/20" className="logout-icon" alt="Log Out"/>
                        </button>
                    </li>
                </ul>
            </nav>
    );

}
export default NavBar;