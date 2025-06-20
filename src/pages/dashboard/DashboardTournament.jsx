import styles from "./dashboard.module.css";
import TournamentProfileInfo
    from "../../components/features/dashElements/tournamentProfileInfo/TournamentProfileInfo.jsx";

import PositionTable from "../../components/features/statsvieuw/PositionTable.jsx";
import UpcomingMatches from "../../components/features/statsvieuw/UpcomingMatches.jsx";
import PastMatches from "../../components/features/statsvieuw/PastMatches.jsx";
import NextMatchLive from "../../components/features/statsvieuw/NextMatchLive.jsx";
import ProfileAreaTournament from "../../components/features/dashElements/profileArea/ProfileAreaTournament.jsx";
import GenerateMatches from "../../components/features/management/GenerateMatches.jsx";

function DashboardTournament() {
    return (
        <div>
            <div className="boxGlobal">
                <div className={styles.info_area}>
                    <ProfileAreaTournament/>
                    <TournamentProfileInfo/>
                </div>
            </div>
            <GenerateMatches/>
            <NextMatchLive/>
            <PositionTable/>
            <UpcomingMatches/>
            <PastMatches/>
        </div>
    );
}

export default DashboardTournament;