import styles from './Dashboard.module.css';
import ProfileArea from "../../components/features/dashElements/profileArea/ProfileArea.jsx";
import NewTournament from "../../components/features/management/NewTournament.jsx";
import TournamentProfileInfo from "../../components/features/dashElements/tournamentProfileInfo/TournamentProfileInfo.jsx";
import NewTeam from "../../components/features/management/NewTeam.jsx";
import Search from "../../components/features/search/Search.jsx";
import TournamentCardInfo from "../../components/features/dashElements/tournamentProfileInfo/TournamentCardInfo.jsx";
import TournamentCard from "../../components/features/statsvieuw/TournamentCard.jsx";



function Dashboard() {
    return (
        <div >
            <div className="boxGlobal">
                <div className={styles.info_area}>
                    <ProfileArea/>
                    <TournamentProfileInfo />
                </div>
            </div>
            <div className={styles.new__create}>
                <NewTournament />
                <NewTeam />
            </div>
            <Search />
            <TournamentCard/>
        </div>
    );
}


export default Dashboard;