

import style from "./StatsVieuw.module.css"


function PastMatches() {
    return (
        <>
            <p className="text__display_tittle">Past Matches</p>
            <div className="boxGlobal">
                <section>
                    <article className={style.next__match_header}>
                        <div>
                            <p className="info__text">SUN 15 ~ 13:45 h</p>
                        </div>
                        <div>
                            <div className={style.match__state}>
                                <p className="info__text_mini">Upcoming</p>
                            </div>
                        </div>
                    </article>
                    <article className={style.next__match_content}>
                        <div className={style.team__card}>
                            <div className={style.team__img_name}>
                                <div className={style.team__img}>
                                    <img src="url" alt=""/>
                                </div>
                                <p className="text_name_small">Team home</p>
                            </div>
                            <div className={style.match__result}>
                                <p className="name__text">0</p>
                            </div>
                        </div>
                        <div className={style.team__card}>

                            <div className={style.match__result}>
                                <p className="name__text">0</p>
                            </div>
                            <div className={style.team__img_name}>
                                <div className={style.team__img}>
                                    <img src="url" alt=""/>
                                </div>
                                <p className="text_name_small">Team Away</p>
                            </div>
                        </div>
                    </article>
                </section>
            </div>
        </>
    )
}

export default PastMatches;
