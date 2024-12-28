import { EmbedBuilder } from 'discord.js';

export function getDefaultEmbed() {
  return new EmbedBuilder().setColor('#7289da');
}

export function formatGameLinescore(args: any) {
  let results: any = {};
  args
    .sort(
      (gameStateA: { gameState: string }, gameStateB: { gameState: string }) =>
        ['CRIT', 'LIVE', 'PRE', 'FUT', 'FINAL', 'OFF'].indexOf(gameStateA.gameState) -
        ['CRIT', 'LIVE', 'PRE', 'FUT', 'FINAL', 'OFF'].indexOf(gameStateB.gameState)
    )
    .forEach((game: any) => {
      const {
        gameType,
        gameDate,
        gameDateShort,
        gameState,
        gameScheduleState,
        gameTimeLocal,
        noSpoilers,
        tvBroadcasts,
        awayTeamAbbrev,
        homeTeamAbbrev,
        awayTeamRecord,
        homeTeamRecord,
        awayTeamScore,
        homeTeamScore,
        awayTeamOdds,
        homeTeamOdds,
        period,
        timeRemaining,
        inIntermission,
        awayTeamSituations,
        homeTeamSituations,
        lastPeriodType,
      } = game;
      const gameLineScoreArr: string[] = [];

      if (gameType) gameLineScoreArr.push(gameType);
      gameLineScoreArr.push(awayTeamAbbrev);
      if (awayTeamRecord && (gameState === 'FUT' || gameState === 'PRE' || noSpoilers))
        gameLineScoreArr.push(`(${awayTeamRecord})`);
      if (awayTeamOdds && homeTeamOdds) gameLineScoreArr.push(`(${awayTeamOdds})`);
      if (awayTeamScore && !noSpoilers) {
        let awayGoals = awayTeamScore;
        if ((gameState === 'FINAL' || gameState === 'OFF') && awayTeamScore > homeTeamScore)
          awayGoals = `**${awayGoals}**`;
        gameLineScoreArr.push(awayGoals);
      }
      if (awayTeamSituations && !noSpoilers) gameLineScoreArr.push(awayTeamSituations);
      if (gameState === 'FUT' || gameState === 'PRE' || noSpoilers) gameLineScoreArr.push('@');
      gameLineScoreArr.push(homeTeamAbbrev);
      if (homeTeamRecord && (gameState === 'FUT' || gameState === 'PRE' || noSpoilers))
        gameLineScoreArr.push(`(${homeTeamRecord})`);
      if (awayTeamOdds && homeTeamOdds) gameLineScoreArr.push(`(${homeTeamOdds})`);
      if (homeTeamScore && !noSpoilers) {
        let homeGoals = homeTeamScore;
        if ((gameState === 'FINAL' || gameState === 'OFF') && homeTeamScore > awayTeamScore)
          homeGoals = `**${homeGoals}**`;
        gameLineScoreArr.push(homeGoals);
      }
      if (homeTeamSituations || !noSpoilers) gameLineScoreArr.push(homeTeamSituations);
      if (gameScheduleState === 'OK' && (gameState === 'FUT' || gameState === 'PRE' || noSpoilers)) {
        gameLineScoreArr.push(gameTimeLocal);
      } else if (gameState === 'FUT' || gameScheduleState === 'PPD') {
        gameLineScoreArr.push('-');
        gameLineScoreArr.push('PPD');
      } else if (!inIntermission && (gameState === 'LIVE' || gameState === 'CRIT')) {
        gameLineScoreArr.push(`(${timeRemaining}${period})`);
      } else if (inIntermission) {
        gameLineScoreArr.push(`(${timeRemaining}${period} INT)`);
      } else if (gameState === 'FINAL' || gameState === 'OFF') {
        gameLineScoreArr.push(`(${lastPeriodType})`);
      }
      if ((gameState !== 'FINAL' || gameState !== 'OFF') && tvBroadcasts) gameLineScoreArr.push(tvBroadcasts);
      if (!results[gameDate]) {
        results[gameDate] = { name: `:hockey: ${gameDateShort}`, value: '' };
      }
      results[gameDate].value += `${gameLineScoreArr.join(' ')}\n`;
    });

  return Object.values(results);
}
