import styles from './Dashboard.module.css';
import ProfileArea from "../../components/dashElements/profileArea/ProfileArea.jsx";
import TournamentProfileInfo from "../../components/dashElements/tournamentProfileInfo/TournamentProfileInfo.jsx";
import JoinTeam from "../../components/features/management/JoinTeam.jsx";
import NewMember from "../../components/features/management/NewMember.jsx";
import NewTeam from "../../components/features/management/NewTeam.jsx";
import NewTournament from "../../components/features/management/NewTournament.jsx";
import NextMatch from "../../components/features/statsvieuw/NextMatch.jsx";
import NextMatchLive from "../../components/features/statsvieuw/NextMatchLive.jsx";
import PositionTable from "../../components/features/statsvieuw/PositionTable.jsx";
import TeamSquad from "../../components/features/statsvieuw/TeamSquad.jsx";
import UpcomingMatches from "../../components/features/statsvieuw/UpcomingMatches.jsx";
import PastMatches from "../../components/features/statsvieuw/PastMatches.jsx";
import TournamentCard from "../../components/features/statsvieuw/TournamentCard.jsx";


function Dashboard() {
    return (
        <div className={styles.dashboardContainer}>
            <div className="boxGlobal">
                <div className={styles.info_area}>
                    <ProfileArea/>.
                    <TournamentProfileInfo/>
                    <NextMatch/>
                </div>
            </div>
            <TournamentCard/>
            <TeamSquad/>
            <PositionTable/>
            <UpcomingMatches/>
            <PastMatches/>
            <NextMatchLive/>
            <JoinTeam/>
            <NewMember/>
            <NewTeam/>
            <NewTournament/>

            <p>Welcome to the dashboard!</p>
            {/* Add more dashboard content here */}
        </div>
    );
}


export default Dashboard;