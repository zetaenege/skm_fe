import style from "./management.module.css";
import Button from "../../common/button/Button.jsx";
import axios from "axios";
import { API } from "../../../Api.jsx";
import { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./management.module.css";

function GenerateMatches({ tournamentId, onMatchesGenerated }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [hasMatches, setHasMatches] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkExistingMatches() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API}/matches/tournament/${tournamentId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        // Si el array trae datos, significa que ya se generaron los partidos
        if (response.data && response.data.length > 0) {
          setHasMatches(true);
        }
      } catch (error) {
        console.error("Error checking matches:", error);
      } finally {
        setChecking(false); // Terminamos de comprobar
      }
    }

    if (tournamentId) {
      checkExistingMatches();
    }
  }, [tournamentId]);

  const handleGenerateMatches = async () => {
    if (
      !window.confirm(
        "Are you sure you want to generate matches for this tournament? This action cannot be undone.",
      )
    ) {
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/tournaments/${tournamentId}/generate-matches`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setMessage({ type: "success", text: "Matches generated successfully!" });

      if (onMatchesGenerated) {
        onMatchesGenerated();
      }
    } catch (error) {
      console.error("Error generating matches:", error);
      setMessage({
        type: "error",
        text: error.response?.data || "Failed to generate matches.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checking) return null;
  if (hasMatches) return null;

  return (
    <div
      className={`boxGlobal animate__item delay_2 ${styles.new__create_gnrt}`}
    >
      <p className="text__display_tittle">Tournament Fixture</p>
      <p className={style.content__text}>
        Click Start to generate the full match schedule and bring the tournament
        to life. All matches for every team will be created, setting the stage
        for the competition to begin.
      </p>
      {message && (
        <p
          style={{
            color: message.type === "success" ? "#4caf50" : "#e94560",
            fontWeight: "bold",
            margin: "10px 0",
          }}
        >
          {message.text}
        </p>
      )}

      <Button
        type="submit"
        children={loading ? "Generating..." : "Generate Matches"}
        onClick={handleGenerateMatches}
      />
    </div>
  );
}

export default GenerateMatches;
