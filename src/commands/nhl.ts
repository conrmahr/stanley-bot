import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, AutocompleteInteraction } from 'discord.js';
import { getDefaultEmbed } from '../utils/embeds.js';
import { getTeamsList, getSchedule, getScheduleByTeam } from '../api/nhle.js';
import { sliceLimit, formatDate } from '../utils/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('nhl')
    .setDescription('Get scores')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('today')
        .setDescription('Get today games')
        .addStringOption((option) => option.setName('team').setDescription('Filter on team').setAutocomplete(true))
        .addBooleanOption((option) => option.setName('broadcast').setDescription('Show TV listing'))
        .addBooleanOption((option) => option.setName('venue').setDescription('Show venue'))
        .addBooleanOption((option) => option.setName('hide').setDescription('Hide scores'))
        .addBooleanOption((option) => option.setName('odds').setDescription('Show Odds'))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('tomorrow')
        .setDescription('Get tomorrow games')
        .addStringOption((option) => option.setName('team').setDescription('Filter on team').setAutocomplete(true))
        .addBooleanOption((option) => option.setName('broadcast').setDescription('Show TV listing'))
        .addBooleanOption((option) => option.setName('venue').setDescription('Show venue'))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('yesterday')
        .setDescription('Get yesterday games')
        .addStringOption((option) => option.setName('team').setDescription('Filter on team').setAutocomplete(true))
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
        .addBooleanOption((option) => option.setName('venue').setDescription('Show venue'))
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
      const teams = await getTeamsList();

      const teamFocused: string[] = teams
        .filter(
          (team: { fullName: string; triCode: string }) =>
            team.fullName.toLowerCase().includes(focusedOption.value.toLowerCase()) ||
            team.triCode.includes(focusedOption.value.toUpperCase())
        )
        .sort((a: { fullName: string }, b: { fullName: string }) => {
          return a.fullName.localeCompare(b.fullName);
        });
      const teamsFiltered = sliceLimit(teamFocused);
      choices = teamsFiltered.map((team) => ({
        name: team.fullName,
        value: `${team.triCode}`,
      }));
    }

    await interaction.respond(choices);
  },
  async execute(interaction: ChatInputCommandInteraction) {
    let data: any = '';
    const today = formatDate({});
    const inputTeam = interaction.options.getString('team') ?? null;
    const inputBroadcast = interaction.options.getBoolean('broadcast') ?? null;
    const inputVenue = interaction.options.getBoolean('venue') ?? null;
    const inputHide = interaction.options.getBoolean('hide') ?? null;
    const inputOdds = interaction.options.getBoolean('odds') ?? null;
    const inputYYYYMMDD = interaction.options.getString('date') ?? today;

    if (interaction.options.getSubcommand() === 'tomorrow') {
      data = await getSchedule({ date: formatDate({ day: 1 }) });
    } else if (interaction.options.getSubcommand() === 'yesterday') {
      data = await getSchedule({ date: formatDate({ day: -1 }) });
    } else if (interaction.options.getSubcommand() === 'week') {
      data = await getScheduleByTeam({ triCode: inputTeam });
    } else if (interaction.options.getSubcommand() === 'yyyy-mm-dd') {
      data = await getSchedule({ date: inputYYYYMMDD });
    } else {
      data = await getSchedule({ date: today });
    }

    // WIP: parse data and filter for embed
    console.log(data, inputTeam, inputBroadcast, inputVenue, inputHide, inputYYYYMMDD);

    const embed = getDefaultEmbed()
      .setAuthor({
        name: `Schedule`,
        iconURL: 'https://i.imgur.com/zl8JzZc.png',
      })
      .setDescription(`NHL Scores`);
    const embeds: EmbedBuilder[] = [];
    embeds.push(embed);
    await interaction.reply({ embeds: embeds });
  },
};
