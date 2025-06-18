import styles from './Dashboard.module.css';
import ProfileArea from "../../components/features/dashElements/profileArea/ProfileArea.jsx";
import NewTournament from "../../components/features/management/NewTournament.jsx";
import TournamentCard from "../../components/features/statsvieuw/TournamentCard.jsx";
import TournamentProfileInfo from "../../components/features/dashElements/tournamentProfileInfo/TournamentProfileInfo.jsx";
import NewTeam from "../../components/features/management/NewTeam.jsx";



function Dashboard() {
    return (
        <div >
            <div className="boxGlobal">
                <div className={styles.info_area}>
                    <ProfileArea/>
                    <TournamentProfileInfo />
                </div>
            </div>
            <NewTeam />
            <NewTournament />
            <TournamentCard/>
        </div>
    );
}


export default Dashboard;