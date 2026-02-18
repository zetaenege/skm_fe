import style from "./StatsVieuw.module.css"
import TeamImg  from "../../../assets/image/Icons/team.svg";


function PositionTable({teams = []}) {

    const sortedTeams = [...teams].sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points;
        }
        return b.goalDifference - a.goalDifference;
    });
    const BRAND_COLORS = [
        'var(--color-aqua)',
        'var(--color-lemon)',
        'var(--color-rosa)',
        'var(--color-violet)'];

    return (
        <>
            <div>
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

                                    // 3. Calculamos el color basado en la posición (index)
                                    // Usamos el operador % para rotar los colores cíclicamente
                                    const rowColor = BRAND_COLORS[index % BRAND_COLORS.length];

                                    return (
                                        <tr key={team.id || index}>
                                            <td className={style.teamInfo_table}>
                                                <p className={style.position}>{index + 1}</p>

                                                <div
                                                    className={style.image_team}
                                                    style={{
                                                        backgroundColor: !team.imgProfile ? rowColor : 'transparent'
                                                    }}
                                                >
                                                    <img
                                                        src={team.imgProfile || TeamImg}
                                                        alt={team.name}
                                                        // Si es el icono por defecto, lo hacemos más pequeño (60%) y usamos 'contain'
                                                        // Si es foto real, usamos 100% y 'cover'
                                                        style={{
                                                            width: !team.imgProfile ? '60%' : '100%',
                                                            height: !team.imgProfile ? '60%' : '100%',
                                                            objectFit: !team.imgProfile ? 'contain' : 'cover'
                                                        }}
                                                    />
                                                </div>

                                                <span className={style.info__name_profile}>{team.name}</span>
                                            </td>
                                            <td className="info__text">{team.matchesPlayed || 0}</td>
                                            <td className="info__text">{team.won || 0}</td>
                                            <td className="info__text">{team.drawn || 0}</td>
                                            <td className="info__text">{team.lost || 0}</td>
                                            <td className="info__text"><strong>{team.points || 0}</strong></td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="info__text" style={{ textAlign: "center", padding: "1rem" }}>
                                        No teams registered in this tournament yet.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <p className="mono">
                    <strong>PL:</strong> Played <strong>W:</strong> Won  <strong> D:</strong>  Draw  <strong> L:</strong>
                    Lost <strong>PTS:</strong> Points
                </p>
            </div>
        </>
    );
}


export default PositionTable;