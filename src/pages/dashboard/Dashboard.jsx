import styles from './Dashboard.module.css';
import ProfileArea from "../../components/dashElements/profileArea/ProfileArea.jsx";
import TournamentInfo from "../../components/dashElements/tournamentInfo/TournamentInfo.jsx";


function Dashboard() {
    return (
        <div className={styles.dashboardContainer}>

            <div className={styles.info_area}>
                <ProfileArea/>.
                <TournamentInfo/>
            </div>


            <p>Welcome to the dashboard!</p>
            {/* Add more dashboard content here */}
        </div>
    );
}


export default Dashboard;