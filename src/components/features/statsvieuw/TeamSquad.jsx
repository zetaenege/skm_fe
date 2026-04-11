import style from "./StatsVieuw.module.css";
import { useEffect, useState } from "react";
import { API } from "../../../Api.jsx";
import axios from "axios";
import TeamImg from "../../../assets/image/Icons/team.svg";

function TeamSquad({ teamId }) {
  const [squad, setSquad] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSquad = async () => {
      if (!teamId) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/teams/${teamId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSquad(res.data.squad || []);
      } catch (error) {
        console.error("Error cargando la plantilla del equipo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSquad();
  }, [teamId]);

  const sortedSquad = [...squad].sort((a, b) =>
    (a.name || "").localeCompare(b.name || ""),
  );

  return (
    <>
      <div className="animate__item delay_2">
        <p className="text__display_tittle section__tittle">Team Squad</p>
        <div className={`${style.team__squad_style} boxGlobal`}>
          <div className={style.position_table}>
            <table>
              <colgroup>
                <col style={{ width: "67%" }} />
                <col style={{ width: "11%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="info__text">Player</th>
                  <th className="info__text">M</th>
                </tr>
              </thead>
              <tbody>
                {!teamId ? (
                  <tr>
                    <td
                      colSpan="2"
                      className="info__text"
                      style={{ textAlign: "center", padding: "1.5rem" }}
                    >
                      Select a team to view its squad.
                    </td>
                  </tr>
                ) : loading ? (
                  <tr>
                    <td
                      colSpan="2"
                      className="info__text"
                      style={{ textAlign: "center", padding: "1.5rem" }}
                    >
                      Loading squad...
                    </td>
                  </tr>
                ) : sortedSquad.length > 0 ? (
                  sortedSquad.map((player) => (
                    <tr key={player.id}>
                      <td className={style.teamInfo_table}>
                        <div className={style.image__squad}>
                          <img
                            src={player.imgProfile || TeamImg}
                            alt={player.name}
                            className={
                              !player.imgProfile
                                ? style.icon__style
                                : style.full__img
                            }
                          />
                        </div>
                        <span className={style.info__name_profile}>
                          {player.name}
                          {player.position && (
                            <small style={{ color: "#888", marginLeft: "5px" }}>
                              ({player.position})
                            </small>
                          )}
                        </span>
                      </td>
                      <td className="info__text">0</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="info__text"
                      style={{ textAlign: "center", padding: "1.5rem" }}
                    >
                      No players registered in this team yet.
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
