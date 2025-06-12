
import style from "./StatsVieuw.module.css"



function TeamSquad() {
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


                  <tr>
                      <td className={style.teamInfo_table}>
                          <div className={style.image_team}>
                              <img src="url"/>
                          </div>
                          <span className="info__text">Daniela Gonzalez</span>
                      </td>
                      <td className="info__text">0</td>
                      <td className="info__text">0</td>
                      <td className="info__text">0</td>
                  </tr>


                  </tbody>
              </table>
          </div>

      </div>
  );
}

export default TeamSquad;
