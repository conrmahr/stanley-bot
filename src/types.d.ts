import discordjs, { SlashCommandBuilder, Collection } from 'discord.js';

declare interface Command {
  data: SlashCommandBuilder;
  execute: Function;
  autocomplete?: Function;
}

declare interface Client extends discordjs.Client {
  commands?: Collection<string, Command>;
}

declare interface Event {
  event: string;
  once: boolean;
  execute: Function;
}

interface SeasonsOptions {
  id?: string;
  entryDraftInUse?: 0 | 1;
}

declare type SeasonsCurrentOptions = string[];

interface ScheduleOptions {
  teamId?: string;
  date?: string;
}

interface ScheduleByTeamOptions {
  abbrev: string | null;
  date?: string;
}

interface TeamOptions {
  teamId?: string;
  season?: string;
  expand?: string;
}

interface DraftOptions {
  draftYear?: string;
  draftedByTeamId?: string | null;
}

interface OfficialOptions {
  id?: string;
  active?: boolean;
}

interface GameLinescoreOptions {
  teamId?: string;
  date?: string | null;
}

interface GameBoxScoreOptions {
  id: string;
}

interface TeamStatsOptions {
  seasonId: string | null;
  teamId: string | null;
}

interface TeamRosterOptions {
  seasonId: string;
  abbrev: string | null;
}

interface Linescore {
  games: Game[];
}

interface Game {
  id: number;
  season: number;
  gameType: number;
  gameDate: string;
  venue: Venue;
  startTimeUTC: string;
  easternUTCOffset: string;
  venueUTCOffset: string;
  tvBroadcasts: Broadcasts[];
  gameState: string;
  gameScheduleState: string;
  awayTeam: Team;
  homeTeam: Team;
  gameCenterLink: string;
  clock: Clock;
  neutralSite: boolean;
  venueTimezone: string;
  period: number;
  periodDescriptor: PeriodDescriptor;
  teamLeaders: TeamLeaders[];
  situation: Situation;
  gameOutcome: GameOutcome;
  goals: Goal[];
}

interface Team {
  id: number;
  name: Venue;
  abbrev: string;
  score: number;
  sog: number;
  record: string;
  logo: string;
  odds: Odds[];
}

interface Venue {
  default: string;
}

interface Odds {
  providerId: number;
  value: string;
}

interface Clock {
  timeRemaining: string;
  secondsRemaining: number;
  running: boolean;
  inIntermission: boolean;
}

interface Goal {
  period: number;
  periodDescriptor: PeriodDescriptor;
  timeInPeriod: string;
  playerId: number;
  name: Venue;
  firstName: FirstName;
  lastName: Venue;
  goalModifier: string;
  assists: Assist[];
  mugshot: string;
  teamAbbrev: string;
  goalsToDate: number;
  awayScore: number;
  homeScore: number;
  strength: string;
}

interface Assist {
  playerId: number;
  name: Name;
  assistsToDate: number;
}

interface Name {
  default: string;
  cs?: string;
  sk?: string;
}

interface FirstName {
  default: string;
  cs?: string;
  de?: string;
  es?: string;
  fi?: string;
  sk?: string;
  sv?: string;
}

interface PeriodDescriptor {
  number: number;
  periodType: string;
  maxRegulationPeriods: number;
}

interface TeamLeaders {
  id: number;
  firstName: FirstName;
  lastName: LastName;
  headshot: string;
  teamAbbrev: string;
  category: string;
  value: number;
}

interface Situation {
  homeTeam: HomeTeam;
  awayTeam: AwayTeam;
  situationCode: string;
}
interface GameOutcome {
  lastPeriodType: string;
  otPeriods: number;
}

interface AwayTeam {
  abbrev: string;
  situationDescriptions: string[];
  strength: number;
}

interface HomeTeam {
  abbrev: string;
  situationDescriptions: string[];
  strength: number;
}

interface Broadcasts {
  id: number;
  market: string;
  countryCode: string;
  network: string;
  sequenceNumber: number;
}

interface PrepGame {
  id: number;
  season: number;
  gameType: number;
  gameDate: string;
  gameDateShort: string;
  startTimeUTC: string;
  tvBroadcasts: string;
  gameState: string;
  gameScheduleState: string;
  gameTimeLocal: string;
  awayTeamAbbrev: string;
  homeTeamAbbrev: string;
  awayTeamRecord?: string;
  homeTeamRecord?: string;
  awayTeamScore?: number;
  homeTeamScore?: number;
  awayTeamOdds?: string;
  homeTeamOdds?: string;
  gameCenterLink?: string;
  timeRemaining?: string;
  running?: boolean;
  inIntermission?: boolean;
  neutralSite: boolean;
  period?: string;
  periodType?: string;
  awayTeamSituations?: string;
  homeTeamSituations?: string;
  lastPeriodType?: string;
  otPeriods?: string;
}
