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
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../assets/context/AuthContext.jsx";
import {API} from "../../Api.jsx";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import menuClose from "../../assets/image/Icons/menu_profile_close.svg";


function DashboardUser() {
    const {user} = useContext(AuthContext);
    const [tournament, setTournament] = useState(null);
    const myTournamentId = user?.tournamentId || 1;
    const myTeamId = user?.teamId || user?.team?.id;
    const navigate = useNavigate();
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

    function handleMenuUser() {
        navigate('/');
    }

    return (
        <div>
            <div className="boxGlobal">
                <button className={styles.menu__close_button} onClick={handleMenuUser} title="Logout">
                    <img src={menuClose} className={styles.menu__close_icon} alt="LogOut"/>
                </button>
                <div className={styles.info_area}>
                    <ProfileArea mode="user"/>
                    <div>
                        <TournamentProfileInfo
                            type="user"
                            tournamentId={user?.tournamentId || 1}
                        />
                        <NextMatch
                            tournamentId={myTournamentId}
                            teamId={myTeamId}
                            tournamentName={tournament?.name}

                        />
                    </div>
                </div>
            </div>

            {user?.isCoach && <NewMember/>}

            {!user?.isCoach && !user?.teamId && (
                <>
                    <div className={styles.new__create}>
                        <JoinTeam/>
                        <NewTeam/>
                    </div>
                </>
            )}

            <div className={styles.table__team_squad}>
                <TeamSquad teamId={myTeamId}/>
                <PositionTable teams={tournament?.teams || []}/>
            </div>


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