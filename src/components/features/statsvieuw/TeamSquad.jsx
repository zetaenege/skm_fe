import style from "./StatsVieuw.module.css"
import {useEffect, useState} from "react";
import {API} from "../../../Api.jsx";
import axios from "axios";
import styles from "../../common/navBAr/navbar.module.css";


function TeamSquad({teamId}) {
    const [squad, setSquad] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSquad = async () => {
            // Si no hay ID de equipo, no hacemos la llamada
            if (!teamId) return;

            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                // Llamamos al endpoint del equipo.
                // Gracias al cambio que hicimos en el Backend, 'res.data' ahora incluye la lista 'squad'
                const res = await axios.get(`${API}/teams/${teamId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Guardamos la lista de jugadores en el estado
                setSquad(res.data.squad || []);

            } catch (error) {
                console.error("Error cargando la plantilla del equipo:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSquad();
    }, [teamId]);

    if (!teamId) return null;

    return (
        <>
            <div>
                <p className="text__display_tittle section__tittle">Team Squad</p>
                <div  className={`${style.team__squad_style} boxGlobal`}>


                    <div className={style.position_table}>
                        <table>
                            <colgroup>
                                <col style={{width: "67%"}}/>
                                <col style={{width: "11%"}}/>

                            </colgroup>
                            <thead>
                            <tr>
                                <th className="info__text">Player</th>
                                <th className="info__text">M</th>


                            </tr>
                            </thead>
                            <tbody>

                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="info__text">Loading...</td>
                                </tr>
                            ) : squad.length > 0 ? (
                                // Mapeamos la lista 'squad' descargada
                                squad.map((player) => (
                                    <tr key={player.id}>
                                        <td className={style.teamInfo_table}>
                                            <div className={style.image__squad}>
                                                {player.imgProfile ? (
                                                    // Si el usuario tiene foto real, usamos <img>
                                                    <img src={player.imgProfile} alt="User Profile"/>
                                                ) : (
                                                    // Si no tiene foto, usamos el SVG como máscara para darle color
                                                    <div className={styles.user__svg_icon}></div>
                                                )}
                                            </div>
                                            <span className={style.info__name_profile}>
                                      {player.name}
                                                {/* Opcional: mostrar posición si existe */}
                                                {player.position &&
                                                    <small style={{
                                                        color: '#888',
                                                        marginLeft: '5px'
                                                    }}>({player.position})</small>}
                                  </span>
                                        </td>

                                        <td className="info__name_profile">0</td>
                                    </tr>
                                ))
                            ) : (
                                // Mensaje si la lista está vacía
                                <tr>
                                    <td colSpan="4" className="info__text" style={{textAlign: 'center'}}>
                                        No players in this team.
                                    </td>
                                </tr>
                            )}

                            </tbody>
                        </table>
                    </div>

                </div>
                <p className="mono">
                    <strong>MP:</strong> Matches played
                </p>
            </div>
        </>
    );
}

export default TeamSquad;
