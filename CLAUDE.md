# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Stanley Bot is a Discord bot that fetches NHL game data from public NHL API endpoints and displays it as Discord embeds. The bot uses discord.js v14 and TypeScript, running on Node.js 21+.

## Development Commands

**Install dependencies:**
```bash
pnpm install
```

**Build and run:**
```bash
pnpm start
```
This compiles TypeScript (`tsc`) and runs the compiled code (`node .`).

**Development note:** There is no watch mode. Run `pnpm start` after making changes.

## Environment Setup

Create a `.env` file with:
- `DISCORD_TOKEN` - Discord bot token
- `DISCORD_CLIENT_ID` - Discord application client ID
- `TIME_ZONE` - (Optional) Timezone for date formatting
- `DEBUG` - (Optional) Enable debug logging

## Architecture

### Command Registration Flow

Commands are automatically discovered and registered at startup:

1. [src/client/client.ts](src/client/client.ts) scans [src/commands/](src/commands/) directory for `.js` files (compiled from TypeScript)
2. Each command file exports a `Command` object with `data` (SlashCommandBuilder) and `execute` function
3. Commands are stored in `client.commands` Collection
4. All commands are registered globally via Discord REST API on startup
5. Command interactions are handled by [src/events/applicationCommand.ts](src/events/applicationCommand.ts)

### Event System

Events in [src/events/](src/events/) are auto-loaded:
- Each event exports `event` (Discord.js event name), `once` (boolean), and `execute` function
- [src/client/client.ts](src/client/client.ts) registers them with `client.on()` or `client.once()`

Key events:
- `applicationCommand.ts` - Handles slash command execution
- `applicationCommandAutocomplete.ts` - Handles autocomplete interactions
- `ready.ts` - Bot ready handler
- `error.ts` / `shardError.ts` - Error handlers

### API Layer

[src/api/nhle.ts](src/api/nhle.ts) contains all NHL API fetch functions:
- Uses `api-web.nhle.com` for newer endpoints (scores, schedules, rosters)
- Uses `api.nhle.com/stats/rest` for legacy stats endpoints
- All functions return parsed JSON or error objects

Key API functions:
- `getGameLinescore()` - Fetches scores for a date (supports "now", "YYYY-MM-DD")
- `getScheduleByTeam()` - Gets week schedule for a team
- `getSeasonCurrent()` - Gets current season ID

### Data Transformation

The `/nhl` command ([src/commands/nhl.ts](src/commands/nhl.ts)) transforms raw API data:
1. Fetches games array from API
2. Maps each game to `PrepGame` object with formatted fields
3. Passes to `formatGameLinescore()` in [src/utils/embeds.ts](src/utils/embeds.ts)
4. Embed formatter groups games by date, sorts by game state (CRIT > LIVE > PRE > FUT > FINAL > OFF)
5. Builds Discord embed fields with formatted scores

### Type Definitions

[src/types.d.ts](src/types.d.ts) contains:
- Discord.js extensions (`Client`, `Command`, `Event`)
- NHL API response types (`Game`, `Team`, `Linescore`, etc.)
- Prepared data types (`PrepGame`)
- API function option types

## Key Behaviors

**Autocomplete:** Team autocomplete in `/nhl week` command filters teams by name or abbreviation, sorted alphabetically, limited to 25 results.

**Game State Ordering:** Games display in priority order: critical > live > upcoming > completed.

**No Spoilers Mode:** `hide` option hides scores and shows only matchups with start times.

**Optional Display Fields:**
- `record` - Show team W-L-OTL records
- `odds` - Show betting odds (provider ID 9)
- `broadcast` - Show TV networks

**Date Formatting:** Uses `dayjs` for date manipulation. Helper functions in [src/utils/helpers.ts](src/utils/helpers.ts).

## Discord.js Patterns

- Commands use `SlashCommandBuilder` for definition
- Interactions are type-checked (`isChatInputCommand()`, `isAutocomplete()`)
- Embeds built with `EmbedBuilder`
- Client uses `IntentsBitField.Flags.Guilds` (no message content needed)

## Important Notes

- Bot uses ES modules (`"type": "module"`)
- Compiled output goes to `dist/` directory
- Entry point after compilation is `dist/app.js`
- pnpm is required package manager (enforced via preinstall hook)
- No testing framework currently configured
