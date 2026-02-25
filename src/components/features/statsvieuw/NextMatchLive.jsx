import style from "./StatsVieuw.module.css";
import ButtonStart from "../../common/button/ButtonStart.jsx";
import { useEffect, useState } from "react";
import { API } from "../../../Api.jsx";
import axios from "axios";
import teamImg from "../../../assets/image/Icons/team.svg";
import Button from "../../common/button/Button.jsx";
import plusIcon from "../../../assets/image/Icons/plus.svg";
import minusIcon from "../../../assets/image/Icons/minus.svg";
import nextMatchIcon from "../../../assets/icons/matchSchedule.svg";
import matchPlayingIcon from "../../../assets/icons/matchPlaying.svg";
import matchFinishedIcon from "../../../assets/icons/matchEnd.svg";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = date
    .toLocaleDateString("en-GB", { weekday: "short", day: "numeric" })
    .toUpperCase();
  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <>
      <span className={style.day__strong}>{day}</span> ~ {time} h
    </>
  );
};

function NextMatchLive({ tournamentId, onMatchFinished }) {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  const [gameStatus, setGameStatus] = useState("PRE");
  const [tournamentName, setTournamentName] = useState("");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  useEffect(() => {
    if (!tournamentId) {
      setLoading(false);
      return;
    }

    const fetchNextMatch = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [matchesRes, tournamentRes] = await Promise.all([
          axios.get(`${API}/matches/tournament/${tournamentId}`, config),
          axios.get(`${API}/tournaments/${tournamentId}`, config),
        ]);

        const next = matchesRes.data.find((m) => m.status === "SCHEDULED");
        if (next) {
          setMatch(next);
          setHomeScore(next.homeScore || 0);
          setAwayScore(next.awayScore || 0);
        } else {
          setMatch(null);
        }
        setTournamentName(tournamentRes.data.name || "Tournament");
      } catch (error) {
        console.error("Error fetching next match:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNextMatch();
  }, [tournamentId]);

  const handleStart = () => {
    setGameStatus("LIVE");
  };

  const handleStop = () => {
    setGameStatus("EDIT");
  };

  const handleSaveResult = async () => {
    try {
      const token = localStorage.getItem("token");

      const updatedMatch = {
        id: match.id,
        teamHomeScore: homeScore,
        teamAwayScore: awayScore,
        status: "FINISHED",
      };

      await axios.put(`${API}/matches/${match.id}`, updatedMatch, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Match finished successfully!");

      setMatch(null);
      setGameStatus("PRE");

      if (onMatchFinished) {
        onMatchFinished();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error saving result:", error);
      alert("Failed to save result.");
    }
  };

  if (loading) {
    return <p>Loading next match...</p>;
  }

  if (!match) return null;

  return (
    <section className={style.next__match_live}>
      <article className={style.next__match_header}>
        <div>
          <p className={style.section__tittle_next}>Next Match</p>
          <p className="info__text">{formatDate(match.matchDate)}</p>
        </div>

        <div>
          <div className={style.match__state}>
            {/* Si está en PRE, mostramos el icono de Matchday */}
            {gameStatus === "PRE" && (
              <img
                src={nextMatchIcon}
                alt="Matchday"
                className={style.icon__svg}
              />
            )}

            {/* Si está en LIVE, mostramos el icono de En Vivo */}
            {gameStatus === "LIVE" && (
              <img
                src={matchPlayingIcon}
                alt="Live Match"
                className={style.icon__svg}
              />
            )}

            {/* Si está en EDIT (antes de guardar), mostramos el icono de Finalizado/Editando */}
            {gameStatus === "EDIT" && (
              <img
                src={matchFinishedIcon}
                alt="Finished Match"
                className={style.icon__svg}
              />
            )}
          </div>
        </div>
      </article>

      <article className={style.next__match_content}>
        {/*Local Team*/}
        <div className={style.team__card}>
          <div className={style.team__img_name}>
            <div className={style.team__img}>
              <img src={match.homeTeam?.imgProfile || teamImg} alt="" />
            </div>

            <p className="text_name_small">{match.homeTeam?.name}</p>

            {gameStatus === "EDIT" && (
              <div className={style.score__controls_panel}>
                {/* Controles LOCAL */}
                <div className={style.control__group}>
                  <div className={style.buttons__row}>
                    <button
                      className={style.btn__score}
                      onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                    >
                      <img
                        src={minusIcon}
                        alt="Plus"
                        className={style.icon__svg}
                      />
                    </button>

                    <button
                      className={style.btn__score}
                      onClick={() => setHomeScore(homeScore + 1)}
                    >
                      <img
                        src={plusIcon}
                        alt="Plus"
                        className={style.icon__svg}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={style.match__result}>
            <p className="name__text">{homeScore}</p>
          </div>
        </div>
        <p className="name__text"> - </p>

        {/*Away Team*/}
        <div className={style.team__card}>
          <div className={style.match__result}>
            <p className="name__text">{awayScore}</p>
          </div>

          <div className={style.team__img_name}>
            <div className={style.team__img}>
              <img
                src={match.awayTeam?.imgProfile || teamImg}
                alt=""
                className={
                  !match.awayTeam?.imgProfile
                    ? style.icon__style
                    : style.full__img
                }
              />
            </div>
            <p className="text_name_small">{match.awayTeam?.name}</p>
            {gameStatus === "EDIT" && (
              <div className={style.score__controls_panel}>
                {/* Controles Visitor */}
                <div className={style.control__group}>
                  <div className={style.buttons__row}>
                    <button
                      className={style.btn__score}
                      onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
                    >
                      <img
                        src={minusIcon}
                        alt="Plus"
                        className={style.icon__svg}
                      />
                    </button>

                    <button
                      className={style.btn__score}
                      onClick={() => setAwayScore(awayScore + 1)}
                    >
                      <img
                        src={plusIcon}
                        alt="Plus"
                        className={style.icon__svg}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      <div className={style.button__start}>
        {gameStatus === "PRE" && (
          <Button
            type="submit"
            variant="violet"
            children="Start Match"
            onClick={handleStart}
          />
        )}

        {gameStatus === "LIVE" && (
          // Aquí podrías usar un botón rojo o cambiar el estilo
          <ButtonStart onClick={handleStop} style={{ backgroundColor: "red" }}>
            Stop Match
          </ButtonStart>
        )}

        {gameStatus === "EDIT" && (
          <ButtonStart onClick={handleSaveResult}>Add Result</ButtonStart>
        )}
      </div>
      <div className={style.name__tournament}>
        <p className="text_name_small">{tournamentName}</p>
      </div>
    </section>
  );
}

export default NextMatchLive;
