import style from "./StatsVieuw.module.css";
import { useEffect, useState, useContext } from "react";
import { API } from "../../../Api.jsx";
import axios from "axios";
import { AuthContext } from "../../../assets/context/AuthContext.jsx";
import profileTeam from "../../../assets/icons/img_team.svg";

function TeamSquad() {
    const { user } = useContext(AuthContext);
    const [squad, setSquad] = useState([]);
    const [teamData, setTeamData] = useState(null);


    console.log("👤 Usuario actual:", user);

    useEffect(() => {
        async function fetchSquad() {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                if (!user?.teamId) return;

                const response = await axios.get(`${API}/teams/${user.teamId}`, { headers });

                setTeamData(response.data);
                setSquad(response.data.squad || []);
            } catch (err) {
                console.error("❌ Error al cargar jugadores del equipo:", err);
            }
        }

        fetchSquad();
    }, [user]);

    return (
        <div className="boxGlobal">
            <div className={style.section_heading}>
                <p className="text__display_tittle">Team Squad</p>
            </div>

            <div className={style.position_table}>
                <table>
                    <colgroup>
                        <col style={{ width: "67%" }} />
                        <col style={{ width: "11%" }} />
                        <col style={{ width: "11%" }} />
                        <col style={{ width: "11%" }} />
                    </colgroup>
                    <thead>
                    <tr>
                        <th className="info__text">Player</th>
                        <th className="info__text">M</th>
                        <th className="info__text">G</th>
                        <th className="info__text">C</th>
                    </tr>
                    </thead>
                    <tbody>
                    {squad.length > 0 ? (
                        squad.map((player) => (
                            <tr key={player.id}>
                                <td className={style.teamInfo_table}>
                                    <div className={style.image_team}>
                                        <img src={player.imgProfile || profileTeam} alt={player.name} />
                                    </div>
                                    <span className="info__text">{player.name}</span>
                                </td>
                                <td className="info__text">{teamData?.matchesPlayed ?? 0}</td>
                                <td className="info__text">N/A</td>
                                <td className="info__text">N/A</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="info__text">No players found.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TeamSquad;