import styles from './Dashboard.module.css';
import ProfileArea from "../../components/features/dashElements/profileArea/ProfileArea.jsx";
import TournamentProfileInfo from "../../components/features/dashElements/tournamentProfileInfo/TournamentProfileInfo.jsx";
import NextMatch from "../../components/features/statsvieuw/NextMatch.jsx";
import NewTeam from "../../components/features/management/NewTeam.jsx";
import JoinTeam from "../../components/features/management/JoinTeam.jsx";
import PositionTable from "../../components/features/statsvieuw/PositionTable.jsx";
import TeamSquad from "../../components/features/statsvieuw/TeamSquad.jsx";
import UpcomingMatches from "../../components/features/statsvieuw/UpcomingMatches.jsx";
import PastMatches from "../../components/features/statsvieuw/PastMatches.jsx";
import NewMember from "../../components/features/management/NewMember.jsx";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../assets/context/AuthContext.jsx";
import {API} from "../../Api.jsx";
import axios from "axios";




function DashboardUser() {
    const { user } = useContext(AuthContext);
    const [tournament, setTournament] = useState(null);
    const myTournamentId = user?.tournamentId || 1;
    const myTeamId = user?.teamId || user?.team?.id;
    console.log("👤 Dashboard User - TeamID detectado:", myTeamId);


    useEffect(() => {

        const searchId = user?.tournamentId || 1;

        const fetchMyTournament = async () => {

            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API}/tournaments/${searchId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("DEBUG - Torneo cargado con éxito:", res.data);
                setTournament(res.data);
            } catch (err) {
                console.error("Error loading user tournament:", err);
            }
        };

        if (user) {
            fetchMyTournament();
        }
    }, [user, myTournamentId]); // Pasamos 'user' como única dependencia estable

    return (
        <div>
            <div className="boxGlobal">
                <div className={styles.info_area}>
                    <ProfileArea mode="user"/>
                    <div>
                        <TournamentProfileInfo
                            type="user"
                            tournamentId={user?.tournamentId || 1}
                        />
                        <NextMatch tournamentId={myTournamentId}
                                   teamId={myTeamId}/>
                    </div>
                </div>
            </div>

            {user?.isCoach && <NewMember />}

            {!user?.isCoach && !user?.teamId && (
                <>
                    <NewTeam />
                    <JoinTeam />
                </>
            )}

            <PositionTable teams={tournament?.teams || []}/>

            <TeamSquad teamId={myTeamId}/>
            <UpcomingMatches
                tournamentId={myTournamentId}
                teamId={myTeamId}
            />
            <PastMatches
                tournamentId={myTournamentId}
                teamId={myTeamId}
            />
        </div>
    );
}


export default DashboardUser;