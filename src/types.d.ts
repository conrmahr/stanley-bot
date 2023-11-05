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

interface ScheduleOptions {
  teamId?: string;
  date?: string;
}

interface ScheduleByTeamOptions {
  triCode: string | null;
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

interface GameBoxscoreOptions {
  id: string;
}

interface TeamStatsOptions {
  seasonId: string | null;
  teamId: string | null;
}

interface TeamRosterOptions {
  seasonId: string;
  triCode: string;
}

interface TeamRosterOptions {
  seasonId: string;
  triCode: string;
}
