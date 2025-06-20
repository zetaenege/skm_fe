import styles from "./TournamentProfileInfo.module.css"
import {useContext, useEffect, useState} from "react";
import {API} from "../../../../Api.jsx";
import axios from "axios";
import {AuthContext} from "../../../../assets/context/AuthContext.jsx";

import profileTeam from "../../../../assets/icons/img_team.svg"


function TournamentProfileInfo() {
    const { user } = useContext(AuthContext);

    const [tournaments, setTournaments] = useState([]);
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [games, setGames] = useState([]);
    const [userTeam, setUserTeam] = useState(null);

    //pocicion del team del usuario
    const [userTeamPosition, setUserTeamPosition] = useState(null);



    useEffect(() => {
        async function fetchAll() {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            try {
                if (user?.isAdmin) {
                    const [resT, resTe, resU, resG] = await Promise.all([
                        axios.get(`${API}/tournaments`, { headers }),
                        axios.get(`${API}/teams`, { headers }),
                        axios.get(`${API}/users`, { headers }),
                        axios.get(`${API}/matches`, { headers }).catch(() => ({ data: [] })),
                    ]);
                    setTournaments(resT.data);
                    setTeams(resTe.data);
                    setPlayers(resU.data);
                    setGames(resG.data || []);
                } else {
                    const [resT, resTe, resG] = await Promise.all([
                        axios.get(`${API}/tournaments`, { headers }),
                        axios.get(`${API}/teams`, { headers }),
                        axios.get(`${API}/matches`, { headers }).catch(() => ({ data: [] })),
                    ]);
                    setTournaments(resT.data);
                    setTeams(resTe.data);
                    setGames(resG.data || []);

                    const team = resTe.data.find((t) => t.id === user?.teamId);
                    setUserTeam(team || null);

                    if (team) {
                        const sortedTeams = [...resTe.data].sort((a, b) => b.pointsTotal - a.pointsTotal);
                        const position = sortedTeams.findIndex((t) => t.id === team.id);
                        if (position !== -1) {
                            setUserTeamPosition(position + 1);
                        }
                    }
                }

            } catch (err) {
                console.error("❌ Error al cargar estadísticas:", err.response?.status, err.config?.url);
            }
        }

        fetchAll();
    }, [user]);

    if (user?.isAdmin) {
        return (
            <div className={styles.info__tournament_section}>
                <article>
                    <p className="name__text">{tournaments.length}</p>
                    <p className="info__text_mini">Tournaments</p>
                </article>
                <article>
                    <p className="name__text">{teams.length}</p>
                    <p className="info__text_mini">Teams</p>
                </article>
                <article>
                    <p className="name__text">{players.length}</p>
                    <p className="info__text_mini">Players</p>
                </article>
                <article>
                    <p className="name__text">{games.length}</p>
                    <p className="info__text_mini">Games</p>
                </article>
            </div>
        );
    }

    // 💡 USER
    return (
        <div className={styles.info__tournament_section}>
            <article>
                <img
                    src={userTeam?.imgProfile || profileTeam}
                    alt={userTeam?.name || "Team"}
                    className={styles.team__image}
                />
            </article>
            <article>
                <p className="name__text">{userTeamPosition ? `#${userTeamPosition}` : "N/A"}</p>
                <p className="info__text_mini">Your Position</p>
            </article>
            <article>
                <p className="name__text">
                    {
                        games.filter((g) =>
                            g.teamAId === user?.teamId || g.teamBId === user?.teamId
                        ).length
                    }
                </p>
                <p className="info__text_mini">Games Played</p>
            </article>
            <article>
                <p className="name__text">
                    {
                        games.reduce((total, game) => {
                            if (game.teamAId === user?.teamId) return total + game.teamAGoals;
                            if (game.teamBId === user?.teamId) return total + game.teamBGoals;
                            return total;
                        }, 0)
                    }
                </p>
                <p className="info__text_mini">Goals Scored</p>
            </article>
        </div>
    );
}



export default TournamentProfileInfo;