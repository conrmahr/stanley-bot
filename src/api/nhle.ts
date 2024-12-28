import { getQueryExpression } from '../utils/helpers.js';
import {
  SeasonsOptions,
  GameLinescoreOptions,
  GameBoxScoreOptions,
  TeamStatsOptions,
  TeamRosterOptions,
  ScheduleOptions,
  ScheduleByTeamOptions,
  Linescore,
} from '../types';

export const getSeasonCurrent = async () => {
  try {
    const response = await fetch(`https://api-web.nhle.com/v1/season`);

    if (!response.ok) {
      console.error(`Failed to fetch current season: ${response.status}`);
      return;
    }

    const data: any = await response.json();

    return data.pop();
  } catch (error) {
    console.error('Failed to fetch current season');
    return error;
  }
};

export const getSeasons = async (args: SeasonsOptions) => {
  try {
    const build = [];
    args.id ? build.push(`id=${args.id}`) : null;
    args.entryDraftInUse ? build.push(`entryDraftInUse=${args.entryDraftInUse}`) : null;
    const query = getQueryExpression(build);
    const response = await fetch(`https://api.nhle.com/stats/rest/en/season?${query}`);

    if (!response.ok) {
      console.error(`Failed to fetch seasons: ${response.status}`);
      return;
    }

    const data: any = await response.json();

    return data;
  } catch (error) {
    console.error('Failed to fetch seasons');
    return error;
  }
};

export const getTeamsList = async () => {
  try {
    const response = await fetch(`https://api-web.nhle.com/v1/schedule-calendar/now`);

    if (!response.ok) {
      console.error(`Failed to fetch teams list: ${response.status}`);
      return;
    }

    const data: any = await response.json();

    return data;
  } catch (error) {
    console.error('Failed to fetch teams list');
    return error;
  }
};

export const getSeasonsList = async () => {
  try {
    const response = await fetch(`https://api-web.nhle.com/v1/season`);

    if (!response.ok) {
      console.error(`Failed to fetch seasons list: ${response.status}`);
      return;
    }

    const { seasons }: any = await response.json();

    return seasons;
  } catch (error) {
    console.error('Failed to fetch seasons list');
    return error;
  }
};

export const getDraftList = async () => {
  try {
    const response = await fetch(`https://api.nhle.com/stats/rest/en/draft`);

    if (!response.ok) {
      console.error(`Failed to fetch draft list: ${response.status}`);
      return;
    }

    const data: any = await response.json();

    return data;
  } catch (error) {
    console.error('Failed to fetch draft list');
    return error;
  }
};

export const getGameBoxScore = async (args: GameBoxScoreOptions) => {
  try {
    const gameId = args.id;

    const response = await fetch(`https://api-web.nhle.com/v1/gamecenter/${gameId}/boxscore`);

    if (!response.ok) {
      console.error(`Failed to fetch game boxscore: ${response.status}`);
      return;
    }

    const data: any = await response.json();

    return data;
  } catch (error) {
    console.error('Failed to fetch game boxscore');
    return error;
  }
};

export const getGameLinescore = async (args: GameLinescoreOptions) => {
  try {
    const date = args.date ? args.date : 'now';
    const response = await fetch(`https://api-web.nhle.com/v1/score/${date}`);

    if (!response.ok) {
      console.error(`Failed to fetch game linescore: ${response.status}`);
      return;
    }

    const result: Linescore = await response.json();

    return result;
  } catch (error) {
    console.error('Failed to fetch game linescore');
    return error;
  }
};

export const getTeamStats = async (args: TeamStatsOptions) => {
  try {
    const build = [];
    args.seasonId ? build.push(`seasonId=${args.seasonId}`) : null;
    args.teamId ? build.push(`teamId=${args.teamId}`) : null;
    const query = getQueryExpression(build);
    const response = await fetch(`https://api.nhle.com/stats/rest/en/team/summary?${query}`);

    if (!response.ok) {
      console.error(`Failed to fetch team stats: ${response.status}`);
      return;
    }

    const data: any = await response.json();

    return data;
  } catch (error) {
    console.error('Failed to fetch team stats');
    return error;
  }
};

export const getTeamByRoster = async (args: TeamRosterOptions) => {
  try {
    const seasonId = args.seasonId;
    const abbrev = args.abbrev;

    const response = await fetch(`https://api-web.nhle.com/v1/roster/${abbrev}/${seasonId}`);

    if (!response.ok) {
      console.error(`Failed to fetch team roster: ${response.status}`);
      return;
    }
    const data: any = await response.json();

    return data;
  } catch (error) {
    console.error('Failed to fetch team roster');
    return error;
  }
};

export const getSchedule = async (args: ScheduleOptions) => {
  try {
    const date = args.date ? args.date : 'now';
    const response = await fetch(`https://api-web.nhle.com/v1/schedule/${date}`);

    if (!response.ok) {
      console.error(`Failed to fetch schedule: ${response.status}`);
      return;
    }

    const data: any = await response.json();

    return data;
  } catch (error) {
    console.error('Failed to fetch schedule');
    return error;
  }
};

export const getScheduleByTeam = async (args: ScheduleByTeamOptions) => {
  try {
    const abbrev = args.abbrev;
    const response = await fetch(`https://api-web.nhle.com/v1/club-schedule/${abbrev}/week/now`);

    if (!response.ok) {
      console.error(`Failed to fetch schedule: ${response.status}`);
      return;
    }

    const data: any = await response.json();

    return data;
  } catch (error) {
    console.error('Failed to fetch schedule');
    return error;
  }
};
