import style from "../statsvieuw/StatsVieuw.module.css";
import Button from "../../common/button/Button.jsx";
import axios from "axios";
import {API} from "../../../Api.jsx";
import {useState} from "react";


function GenerateMatches({tournamentId,onMatchesGenerated}) {

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleGenerateMatches = async () => {
        if (!window.confirm("Are you sure you want to generate matches for this tournament? This action cannot be undone.")) {
            return;
        }
        setLoading(true);
        setMessage(null);

        try{
            const token = localStorage.getItem("token");

            await axios.post(`${API}/tournaments/${tournamentId}/generate-matches`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage({ type: 'success', text: 'Matches generated successfully!' });

            if (onMatchesGenerated) {
                onMatchesGenerated();
            }

        }catch(error){
            console.error("Error generating matches:", error);
            setMessage({
                type: 'error',
                text: error.response?.data || 'Failed to generate matches.'
            });
        }finally {
            setLoading(false);
        }
    };


  return (
      <div className="boxGlobal">

          <p className="text__display_tittle">Tournament Fixture</p>
          <p className={style.content__text}>Generate the match schedule for all teams in this tournament.</p>
          {message && (
              <p style={{ color: message.type === 'success' ? '#4caf50' : '#e94560', fontWeight: 'bold', margin: '10px 0' }}>
                  {message.text}
              </p>
          )}

          <Button
              type="submit"
              children={loading ? "Generating..." : "Generate Matches"}
              onClick={handleGenerateMatches}/>
      </div>
  );
}
export default GenerateMatches;