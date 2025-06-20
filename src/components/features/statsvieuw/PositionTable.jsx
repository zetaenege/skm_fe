import style from "./StatsVieuw.module.css";
import { useEffect, useState } from "react";
import { API } from "../../../Api.jsx";
import axios from "axios";
import profileTeam from "../../../assets/icons/img_team.svg";

function PositionTable() {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        async function fetchTeams() {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.get(`${API}/teams`, { headers });

                const sortedTeams = response.data.sort(
                    (a, b) => b.pointsTotal - a.pointsTotal
                );
                setTeams(sortedTeams);
            } catch (err) {
                console.error("❌ Error al cargar equipos:", err);
            }
        }

        fetchTeams();
    }, []);

    return (
        <div className="boxGlobal">
            <div className={style.section_heading}>
                <p className="text__display_tittle">Position Table</p>
            </div>

            <div className={style.position_table}>
                <table>
                    <colgroup>
                        <col style={{ width: "45%" }} />
                        <col style={{ width: "11%" }} />
                        <col style={{ width: "11%" }} />
                        <col style={{ width: "11%" }} />
                        <col style={{ width: "11%" }} />
                        <col style={{ width: "11%" }} />
                    </colgroup>
                    <thead>
                    <tr>
                        <th className="info__text">Team</th>
                        <th className="info__text">PL</th>
                        <th className="info__text">W</th>
                        <th className="info__text">D</th>
                        <th className="info__text">L</th>
                        <th className="info__text">PTS</th>
                    </tr>
                    </thead>
                    <tbody>
                    {teams.map((team, index) => (
                        <tr key={team.id}>
                            <td className={style.teamInfo_table}>
                                <p className={style.position}>{index + 1}</p>
                                <div className={style.image_team}>
                                    <img
                                        src={team.imgProfile || profileTeam}
                                        alt={team.name}
                                    />
                                </div>
                                <span className="info__text">{team.name}</span>
                            </td>
                            <td className="info__text">{team.matchesPlayed  ?? 0}</td>
                            <td className="info__text">{team.matchesWon  ?? 0}</td>
                            <td className="info__text">{team.matchesDrawn  ?? 0}</td>
                            <td className="info__text">{team.matchesLost  ?? 0}</td>
                            <td className="info__text">{team.pointsTotal ?? 0}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PositionTable;