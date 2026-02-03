import style from "./StatsVieuw.module.css"


function PositionTable({teams = []}) {

    const sortedTeams = [...teams].sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points;
        }
        return b.goalDifference - a.goalDifference;
    });

    return (

        <div className="boxGlobal">
            <div className={style.section_heading}>
                <p className="text__display_tittle">Position Table</p>
            </div>

            <div className={style.position_table}>
                <table>
                    <colgroup>
                        <col style={{width: "45%"}}/>
                        <col style={{width: "11%"}}/>
                        <col style={{width: "11%"}}/>
                        <col style={{width: "11%"}}/>
                        <col style={{width: "11%"}}/>
                        <col style={{width: "11%"}}/>
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
                        sortedTeams.map((team, index) => (
                            <tr key={team.id || index}>
                                <td className={style.teamInfo_table}>
                                    <p className={style.position}>{index + 1}</p>
                                    <div className={style.image_team}>
                                        <img
                                            src={team.imgProfile || "/default-team.png"}
                                            alt={team.name}
                                        />
                                    </div>
                                    <span className="info__text">{team.name}</span>
                                </td>
                                <td className="info__text">{team.matchesPlayed || 0}</td>
                                <td className="info__text">{team.won || 0}</td>
                                <td className="info__text">{team.drawn || 0}</td>
                                <td className="info__text">{team.lost || 0}</td>
                                <td className="info__text"><strong>{team.points || 0}</strong></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="info__text" style={{textAlign: "center", padding: "1rem"}}>
                                No teams registered in this tournament yet.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

        </div>

    )
}


export default PositionTable;