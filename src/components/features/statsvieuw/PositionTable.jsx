import style from "./StatsVieuw.module.css";
import TeamImg from "../../../assets/image/Icons/team.svg";

function PositionTable({ teams = [] }) {
  // --- SORT REFACTORIZADO A UNA SOLA LÍNEA ---
  const sortedTeams = [...teams].sort(
    (a, b) =>
      (b.points || 0) - (a.points || 0) ||
      (b.goalDifference || 0) - (a.goalDifference || 0),
  );

  return (
    <>
      <div className="global__section_style animate__item delay_3">
        <p className="text__display_tittle section__tittle">Position Table</p>
        <div className="boxGlobal">
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
                {sortedTeams.length > 0 ? (
                  sortedTeams.map((team, index) => {
                    return (
                      <tr key={team.id || index}>
                        <td className={style.teamInfo_table}>
                          <p className={style.position}>{index + 1}</p>

                          <div className={style.image_team}>
                            <img
                              src={team.imgProfile || TeamImg}
                              alt={team.name}
                              className={
                                !team.imgProfile
                                  ? style.icon__style
                                  : style.full__img
                              }
                            />
                          </div>

                          <span className={style.info__name_profile}>
                            {team.name}
                          </span>
                        </td>
                        <td className="info__text">
                          {team.matchesPlayed || 0}
                        </td>
                        <td className="info__text">{team.won || 0}</td>
                        <td className="info__text">{team.drawn || 0}</td>
                        <td className="info__text">{team.lost || 0}</td>
                        <td className="info__text">
                          <strong>{team.points || 0}</strong>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  // MENSAJE DE TABLA VACÍA
                  <tr>
                    <td
                      colSpan="6"
                      className="info__text"
                      style={{ textAlign: "center", padding: "1.5rem" }}
                    >
                      No teams registered in this tournament yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mono">
          <strong>PL:</strong> Played <strong>W:</strong> Won{" "}
          <strong> D:</strong> Draw <strong> L:</strong>
          Lost <strong>PTS:</strong> Points
        </p>
      </div>
    </>
  );
}

export default PositionTable;
