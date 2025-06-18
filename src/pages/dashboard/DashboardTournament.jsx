import styles from "./dashboard.module.css";
import ProfileArea from "../../components/features/dashElements/profileArea/ProfileArea.jsx";
import TournamentProfileInfo
    from "../../components/features/dashElements/tournamentProfileInfo/TournamentProfileInfo.jsx";

import PositionTable from "../../components/features/statsvieuw/PositionTable.jsx";
import UpcomingMatches from "../../components/features/statsvieuw/UpcomingMatches.jsx";
import PastMatches from "../../components/features/statsvieuw/PastMatches.jsx";
import NextMatchLive from "../../components/features/statsvieuw/NextMatchLive.jsx";

function DashboardTournament() {
    return (
        <div>
            <div className="boxGlobal">
                <div className={styles.info_area}>
                    <ProfileArea/>
                    <TournamentProfileInfo/>
                </div>
            </div>
            <NextMatchLive/>
            <PositionTable/>
            <UpcomingMatches/>
            <PastMatches/>
        </div>
    );
}

export default DashboardTournament;