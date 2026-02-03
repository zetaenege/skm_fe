
import style from "./StatsVieuw.module.css"
import {useEffect, useState} from "react";
import {API} from "../../../Api.jsx";
import axios from "axios";



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
      <div className="boxGlobal">
          <div className={style.section_heading}>
              <p className="text__display_tittle">Team Squad</p>
          </div>

          <div className={style.position_table}>
              <table>
                  <colgroup>
                      <col style={{width: "67%"}}/>
                      <col style={{width: "11%"}}/>
                      <col style={{width: "11%"}}/>
                      <col style={{width: "11%"}}/>
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

                  {loading ? (
                      <tr>
                          <td colSpan="4" className="info__text">Loading...</td>
                      </tr>
                  ) : squad.length > 0 ? (
                      // Mapeamos la lista 'squad' descargada
                      squad.map((player) => (
                          <tr key={player.id}>
                              <td className={style.teamInfo_table}>
                                  <div className={style.image_team}>
                                      <img
                                          src={player.imgProfile || "/default-user.png"}
                                          alt={player.name}
                                          onError={(e) => {
                                              e.target.src = "/default-user.png"
                                          }} // Fallback si la imagen falla
                                      />
                                  </div>
                                  <span className="info__text">
                                      {player.name}
                                      {/* Opcional: mostrar posición si existe */}
                                      {player.position &&
                                          <small style={{color: '#888', marginLeft: '5px'}}>({player.position})</small>}
                                  </span>
                              </td>
                              <td className="info__text">0</td>
                              <td className="info__text">0</td>
                              <td className="info__text">0</td>
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
  );
}

export default TeamSquad;
