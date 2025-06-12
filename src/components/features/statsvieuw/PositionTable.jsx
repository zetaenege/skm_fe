import style from "./StatsVieuw.module.css"


function PositionTable() {

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


                    <tr>
                        <td className={style.teamInfo_table}>
                            <p className={style.position}>1</p>
                            <div className={style.image_team}>
                                <img src="url"/>
                            </div>
                            <span className="info__text">St.Rosa FC</span>
                        </td>
                        <td className="info__text">0</td>
                        <td className="info__text">0</td>
                        <td className="info__text">0</td>
                        <td className="info__text">0</td>
                        <td className="info__text">0</td>
                    </tr>


                    </tbody>
                </table>
            </div>

        </div>

    )
}


export default PositionTable;