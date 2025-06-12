import styles from "./TournamentProfileInfo.module.css"


function TournamentProfileInfo() {
    return (
        <div className="tournament-info">

            <div className={styles.info__tournament_section}>
                <article>
                    <p className="name__text">12</p>
                    <p className="info__text_mini">Tournaments</p>
                </article>
                <article>
                    <p className="name__text">50</p>
                    <p className="info__text_mini">Teams</p>
                </article>
                <article>
                    <p className="name__text">187</p>
                    <p className="info__text_mini">Players</p>
                </article>
                <article>
                    <p className="name__text">1763</p>
                    <p className="info__text_mini">Games</p>
                </article>

            </div>
        </div>
    );

}

export default TournamentProfileInfo;