import style from "./StatsVieuw.module.css"
import Button from "../../common/button/Button.jsx";


function TournamentCard() {
    return (
        <>
            <div className="boxGlobal">

                <section className={style.tournament__card}>
                    <article className={style.next__match_header}>
                        <div>
                            <p className="text__display_tittle_mini">Tournament #294</p>
                        </div>
                        <div>
                        <p className="info__text">Start: 07 - Mar | End: 18 Jul</p>
                        </div>
                    </article>


                    <article >
                        <div className={style.profile_wrapper}>
                            <div className={style.img__profile}>
                                <img/>
                            </div>
                            <div className={style.profile__info}>
                                <p className="name__text">Waterlemon League</p>
                                <p className="info__text">Leeuwce</p>
                            </div>
                        </div>
                    </article>

                    <Button type="submit" children="Manage Tournament "/>
                </section>

            </div>
        </>
    )
}

export default TournamentCard;
