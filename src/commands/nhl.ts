import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, AutocompleteInteraction } from 'discord.js';
import { getDefaultEmbed, formatGameLinescore } from '../utils/embeds.js';
import { getTeamsList, getScheduleByTeam, getGameLinescore } from '../api/nhle.js';
import { sliceLimit, formatDate, formatGameDate, formatGameTime } from '../utils/helpers.js';
import { Game } from '../types';

export default {
  data: new SlashCommandBuilder()
    .setName('nhl')
    .setDescription('Get scores')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('now')
        .setDescription('Get latest scores')
        .addBooleanOption((option) => option.setName('odds').setDescription('Show odds'))
        .addBooleanOption((option) => option.setName('broadcast').setDescription('Show TV listing'))
        .addBooleanOption((option) => option.setName('hide').setDescription('Hide scores'))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('tomorrow')
        .setDescription('Get tomorrow games')
        .addBooleanOption((option) => option.setName('odds').setDescription('Show odds'))
        .addBooleanOption((option) => option.setName('broadcast').setDescription('Show TV listing'))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('yesterday')
        .setDescription('Get yesterday scores')
        .addBooleanOption((option) => option.setName('hide').setDescription('No spoilers'))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('week')
        .setDescription("Get a team's games this week")
        .addStringOption((option) =>
          option.setName('team').setDescription('Filter on team').setAutocomplete(true).setRequired(true)
        )
        .addBooleanOption((option) => option.setName('broadcast').setDescription('Show TV listing'))
        .addBooleanOption((option) => option.setName('hide').setDescription('No spoilers'))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('yyyy-mm-dd')
        .setDescription('Get games for specific date')
        .addStringOption((option) =>
          option.setName('date').setDescription('YYYY-MM-DD format').setRequired(true).setMinLength(10).setMaxLength(10)
        )
    ),
  async autocomplete(interaction: AutocompleteInteraction) {
    let choices: { name: string; value: string }[] = [];
    const focusedOption: { name: string; value: string } = interaction.options.getFocused(true);

    if (focusedOption.name === 'team') {
      const { teams } = await getTeamsList();

      const teamFocused: string[] = teams
        .filter(
          (team: { name: { default: string }; abbrev: string }) =>
            team.name.default.toLowerCase().includes(focusedOption.value.toLowerCase()) ||
            team.abbrev.includes(focusedOption.value.toUpperCase())
        )
        .sort((a: { name: { default: string } }, b: { name: { default: string } }) => {
          return a.name.default.localeCompare(b.name.default);
        });
      const teamsFiltered = sliceLimit(teamFocused);
      choices = teamsFiltered.map((team) => ({
        name: team.name.default,
        value: `${team.abbrev}`,
      }));
    }

    await interaction.respond(choices);
  },
  async execute(interaction: ChatInputCommandInteraction) {
    let data: any;
    const inputTeam = interaction.options.getString('team') ?? null;
    const inputBroadcast = interaction.options.getBoolean('broadcast') ?? null;
    const inputOdds = interaction.options.getBoolean('odds') ?? null;
    const inputHide = interaction.options.getBoolean('hide') ?? null;
    const inputYYYYMMDD = interaction.options.getString('date') ?? null;

    if (interaction.options.getSubcommand() === 'tomorrow') {
      data = await getGameLinescore({ date: formatDate({ day: 1 }) });
    } else if (interaction.options.getSubcommand() === 'yesterday') {
      data = await getGameLinescore({ date: formatDate({ day: -1 }) });
    } else if (interaction.options.getSubcommand() === 'yyyy-mm-dd') {
      data = await getGameLinescore({ date: inputYYYYMMDD });
    } else if (interaction.options.getSubcommand() === 'week') {
      data = await getScheduleByTeam({ abbrev: inputTeam });
    } else {
      data = await getGameLinescore({ date: formatDate({}) });
    }

    const prepGames = data.games.map((f: Game) => {
      return {
        gameType: f.gameType === 2 ? null : f.gameType === 1 ? '[PR]' : f.gameType === 3 ? '[Playoffs]' : '[Ex]',
        gameDate: f.gameDate,
        gameDateShort: formatGameDate(f.startTimeUTC),
        gameState: f.gameState,
        gameScheduleState: f.gameScheduleState,
        gameTimeLocal: formatGameTime(f.startTimeUTC),
        tvBroadcasts:
          f.tvBroadcasts.length && inputBroadcast ? `:tv: [${f.tvBroadcasts.map((b) => b.network).join(', ')}]` : null,
        noSpoilers: inputHide,
        awayTeamAbbrev: f.awayTeam.abbrev,
        homeTeamAbbrev: f.homeTeam.abbrev,
        awayTeamRecord: !inputOdds && f.awayTeam.record ? f.awayTeam.record : null,
        homeTeamRecord: !inputOdds && f.homeTeam.record ? f.homeTeam.record : null,
        awayTeamScore: f.awayTeam.score >= 0 ? `${f.awayTeam.score}` : null,
        homeTeamScore: f.homeTeam.score >= 0 ? `${f.homeTeam.score}` : null,
        awayTeamOdds:
          f.awayTeam?.odds && inputOdds
            ? `${f.awayTeam.odds
                .filter((o) => o.providerId === 9) // US partnerId
                .map((v) => v.value)
                .join('')}`
            : null,
        homeTeamOdds:
          f.awayTeam?.odds && inputOdds
            ? `${f.homeTeam.odds
                .filter((o) => o.providerId === 9) // US partnerId
                .map((v) => v.value)
                .join('')}`
            : null,
        period: f.period
          ? f.period === 1
            ? '/1st'
            : f.period === 2
            ? '/2nd'
            : f.period === 3
            ? '/3rd'
            : f.period === 4
            ? '/OT'
            : f.period === 5
            ? '/SO'
            : 'error'
          : null,
        timeRemaining: f.clock?.timeRemaining ? f.clock.timeRemaining : null,
        inIntermission: f.clock?.inIntermission ? f.clock.inIntermission : null,
        periodType: f.periodDescriptor?.periodType ? f.periodDescriptor.periodType : null,
        awayTeamSituations: f.situation?.awayTeam?.situationDescriptions
          ? `[${f.situation.awayTeam.situationDescriptions.join(' ')}]`
          : null,
        homeTeamSituations: f.situation?.homeTeam?.situationDescriptions
          ? `[${f.situation.homeTeam.situationDescriptions.join(' ')}]`
          : null,
        lastPeriodType: f.gameOutcome?.lastPeriodType
          ? f.gameOutcome.lastPeriodType === 'REG'
            ? 'F'
            : `F/${f.gameOutcome.lastPeriodType}`
          : null,
      };
    });

    const embed = getDefaultEmbed().setAuthor({
      name: `Scores`,
      iconURL: 'https://i.imgur.com/zl8JzZc.png',
    });
    const embedGames: any =
      prepGames.length > 0
        ? formatGameLinescore(prepGames)
        : { name: formatGameDate(data.currentDate), value: 'No games found' };
    embed.addFields(embedGames);
    const embeds: EmbedBuilder[] = [];
    embeds.push(embed);
    await interaction.reply({ embeds: embeds });
  },
};
