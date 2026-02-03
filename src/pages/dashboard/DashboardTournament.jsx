import styles from "./dashboard.module.css";
import ProfileArea from "../../components/features/dashElements/profileArea/ProfileArea.jsx";
import TournamentProfileInfo
    from "../../components/features/dashElements/tournamentProfileInfo/TournamentProfileInfo.jsx";
import GenerateMatches from "../../components/features/management/GenarateMatches.jsx";
import PositionTable from "../../components/features/statsvieuw/PositionTable.jsx";
import UpcomingMatches from "../../components/features/statsvieuw/UpcomingMatches.jsx";
import PastMatches from "../../components/features/statsvieuw/PastMatches.jsx";
import NextMatchLive from "../../components/features/statsvieuw/NextMatchLive.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {API} from "../../Api.jsx";
import axios from "axios";

function DashboardTournament() {
    const { id } = useParams();
    const [tournament, setTournament] = useState(null);;
    useEffect(() => {
        const fetchTournamentData = async () => {
            try {
                const token = localStorage.getItem("token");


                const res = await axios.get(`${API}/tournaments/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log("Datos del torneo cargados:", res.data);
                setTournament(res.data);

            } catch (err) {
                console.error("Error cargando el torneo:", err);
            }
        };

        if (id) {
            fetchTournamentData();
        }
    }, [id]);

    return (
        <div>
            <div className="boxGlobal">
                <div className={styles.info_area}>
                    <ProfileArea mode="tournament" tournamentId={id} />
                    <TournamentProfileInfo type="tournament" tournamentId={id} />
                </div>
            </div>
            <GenerateMatches tournamentId={id}
                             onMatchesGenerated={() => window.location.reload()}
                                 />
            <NextMatchLive tournamentId={id} />
            <PositionTable teams={tournament?.teams || []}/>
            <UpcomingMatches tournamentId={id}/>
            <PastMatches  tournamentId={id}/>
        </div>
    );
}

export default DashboardTournament;