import Button from "../components/common/button/Button.jsx";

function DownloadReport({ tournament, champion, userTeamId, matches }) {
  const handleDownload = () => {
    if (!tournament) return;

    let reportContent = `========================================\n`;
    reportContent += `      TOURNAMENT FINAL REPORT\n`;
    reportContent += `========================================\n\n`;

    reportContent += `LEAGUE: ${tournament.name || "TBA"}\n`;
    reportContent += `CITY: ${tournament.city || "Unknown"}\n`;
    reportContent += `START: ${tournament.startDate || "N/A"}   END: ${tournament.endDate || "N/A"}\n`;

    if (champion) {
      reportContent += `\n CHAMPION: ${champion.name} \n`;
      reportContent += ` TOTAL POINTS: ${champion.points || 0}\n`;
      reportContent += ` TOTAL GOALS SCORED: ${champion.goalsFor || 0}\n\n`;
    }

    const sortedTeams = [...(tournament.teams || [])].sort(
      (a, b) =>
        (b.points || 0) - (a.points || 0) ||
        (b.goalDifference || 0) - (a.goalDifference || 0),
    );

    if (sortedTeams.length > 0) {
      reportContent += `----------------------------------------\n`;
      reportContent += ` THE PODIUM\n`;
      reportContent += `----------------------------------------\n`;
      const suffixes = ["1st", "2nd", "3rd"];
      sortedTeams.slice(0, 3).forEach((team, index) => {
        reportContent += ` ${suffixes[index]} - ${team.name || "Unknown"}\n`;
      });
      reportContent += `\n`;
    }

    reportContent += `----------------------------------------\n`;
    reportContent += ` FINAL STANDINGS\n`;
    reportContent += `----------------------------------------\n`;
    reportContent += `POS | TEAM NAME          | PTS | GD \n`;

    sortedTeams.forEach((team, index) => {
      const pos = String(index + 1).padEnd(3, " ");
      const name = (team.name || "Unknown").padEnd(18, " ");
      const pts = String(team.points || 0).padEnd(3, " ");
      const gd = String(team.goalDifference || 0);
      reportContent += ` ${pos}| ${name}| ${pts} | ${gd}\n`;
    });

    // --- AQUÍ ESTÁ EL CAMBIO PARA FILTRAR POR EQUIPO ---
    if (userTeamId && matches && matches.length > 0) {
      reportContent += `\n----------------------------------------\n`;
      reportContent += ` YOUR TEAM'S PAST MATCHES\n`;
      reportContent += `----------------------------------------\n`;

      const myPastMatches = matches.filter(
        (m) =>
          m.status === "FINISHED" &&
          (String(m.homeTeamId) === String(userTeamId) ||
            String(m.awayTeamId) === String(userTeamId)),
      );

      if (myPastMatches.length === 0) {
        reportContent += `No past matches recorded for your team.\n`;
      } else {
        myPastMatches.forEach((m) => {
          const home = m.homeTeamName || `Team ${m.homeTeamId}`;
          const away = m.awayTeamName || `Team ${m.awayTeamId}`;
          reportContent += `${home} [ ${m.homeScore} - ${m.awayScore} ] ${away}\n`;
        });
      }
    }

    reportContent += `\n========================================\n`;
    reportContent += ` CONGRATULATIONS TO ALL PARTICIPANTS!\n`;
    reportContent += ` Thank you for a great season.\n`;
    reportContent += `========================================`;

    const blob = new Blob([reportContent], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(tournament.name || "Tournament").replace(/\s+/g, "_")}_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      type="submit"
      children=" Download Final Report"
      variant="primary"
      onClick={handleDownload}
    />
  );
}

export default DownloadReport;
