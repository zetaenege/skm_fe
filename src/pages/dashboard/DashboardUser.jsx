import styles from './Dashboard.module.css';
import ProfileArea from "../../components/features/dashElements/profileArea/ProfileArea.jsx";
import TournamentProfileInfo
    from "../../components/features/dashElements/tournamentProfileInfo/TournamentProfileInfo.jsx";
import NextMatch from "../../components/features/statsvieuw/NextMatch.jsx";
import NewTeam from "../../components/features/management/NewTeam.jsx";
import JoinTeam from "../../components/features/management/JoinTeam.jsx";
import PositionTable from "../../components/features/statsvieuw/PositionTable.jsx";
import TeamSquad from "../../components/features/statsvieuw/TeamSquad.jsx";
import UpcomingMatches from "../../components/features/statsvieuw/UpcomingMatches.jsx";
import PastMatches from "../../components/features/statsvieuw/PastMatches.jsx";
import NewMember from "../../components/features/management/NewMember.jsx";
import {useContext} from "react";
import {AuthContext} from "../../assets/context/AuthContext.jsx";


function DashboardUser() {
    const {user} = useContext(AuthContext);
    return (
        <div>
            <div className="boxGlobal">
                <div className={styles.info_area}>
                    <ProfileArea/>
                    <div>
                        <TournamentProfileInfo/>
                        <NextMatch/>
                    </div>
                </div>
            </div>
            {user?.isCoach && <NewMember/>}
            {!user?.isCoach && !user?.teamId && (
                <>
                    <NewTeam/>
                    <JoinTeam/>
                </>
            )}
            {user?.teamId && (
                <>
                    <PositionTable/>
                    <TeamSquad/>
                    <UpcomingMatches/>
                    <PastMatches/>
                </>
            )}


        </div>
    );
}


export default DashboardUser;