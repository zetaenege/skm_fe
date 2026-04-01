import teamImg from "../../../../../assets/icons/teamIcon.svg";
import style from "./Champion.module.css";

function Champion({ team, tournament }) {
  if (!team || !tournament) return null;

  // Formateamos la fecha de finalización (Ej: "18 July 2026")
  const formattedDate = tournament.endDate
    ? new Date(tournament.endDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
      })
    : "TBD";

  return (
    <div className={style.champion__wrapper}>
      <h2 className="text__display_tittle"> Tournament Finished </h2>
      <p className="mono__c">The Champion is:</p>
      <section className={style.team__champ_wrapper}>
        <div className={style.team__img}>
          <img
            className={style.full__img}
            src={team.imgProfile || teamImg}
            alt={team.name}
          />
        </div>
        <h3 className={style.team__name}>{team.name}</h3>
      </section>
      <section className={style.info__champ_wrapper}>
        <p className="mono__c">
          Points:<strong> {team.points || 0}</strong> | Goal Difference:{" "}
          <strong> {team.goalDifference || 0}</strong>
        </p>

        <p className="mono__c">
          Winner of the: <strong>{tournament.name}</strong>, Crowned on{" "}
          {formattedDate}.
        </p>
      </section>
    </div>
  );
}

export default Champion;
