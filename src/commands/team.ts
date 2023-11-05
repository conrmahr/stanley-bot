import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, AutocompleteInteraction } from 'discord.js';
import { getDefaultEmbed } from '../utils/embeds.js';
import { getSeasonCurrent, getTeamsList, getSeasonsList, getTeamStats, getTeamByRoster } from '../api/nhle.js';
import { sliceLimit } from '../utils/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('team')
    .setDescription('Team')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('stats')
        .setDescription('Team stats')
        .addStringOption((option) =>
          option.setName('team').setDescription('Filter on team').setAutocomplete(true).setRequired(true)
        )
        .addStringOption((option) => option.setName('season').setDescription('Season').setAutocomplete(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('roster')
        .setDescription('Team roster')
        .addStringOption((option) =>
          option.setName('team').setDescription('Filter on team').setAutocomplete(true).setRequired(true)
        )
        .addStringOption((option) => option.setName('season').setDescription('Season').setAutocomplete(true))
    ),
  async autocomplete(interaction: AutocompleteInteraction) {
    let choices: { name: string; value: string }[] = [];
    const focusedOption: { name: string; value: string } = interaction.options.getFocused(true);

    if (focusedOption.name === 'season') {
      const seasons = await getSeasonsList();
      const seasonsFocused: string[] = seasons.sort().reverse();
      const seasonsFiltered = sliceLimit(seasonsFocused);

      choices = seasonsFiltered.map((season) => ({
        name: `${season.toString().substring(0, 4)}-${season.toString().substring(4)}`,
        value: `${season}`,
      }));
    }

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
        value: `${team.id}`,
      }));
    }

    await interaction.respond(choices);
  },
  async execute(interaction: ChatInputCommandInteraction) {
    const [current] = await getSeasonCurrent();
    let fields;

    const inputTeam = interaction.options.getString('team');
    const inputYear = interaction.options.getString('season') ?? `${current.seasonId}`;

    if (interaction.options.getSubcommand() === 'roster') {
      const teams = await getTeamsList();

      const abbreviation: { triCode: string } = teams.find((team: { id: string }) => {
        return team.id.toString() === inputTeam;
      });

      const roster = await getTeamByRoster({ seasonId: inputYear, triCode: abbreviation.triCode });

      fields = roster.forwards.map(
        (field: { firstName: { default: string }; lastName: { default: string } }) =>
          `${field.firstName.default} ${field.lastName.default}`
      );
    } else {
      const seasons = await getTeamStats({ seasonId: inputYear, teamId: inputTeam });

      fields = seasons.map(
        (field: { gamesPlayed: number; goalsAgainst: number; losses: string; teamFullName: string }) =>
          `${field.gamesPlayed} ${field.goalsAgainst} ${field.losses} ${field.teamFullName}`
      );
    }

    const body = fields.length > 0 ? fields : ['No results'];
    const embed = getDefaultEmbed()
      .setAuthor({
        name: `${inputYear} Team Stats`,
        iconURL: 'https://i.imgur.com/zl8JzZc.png',
      })
      .setThumbnail('https://i.imgur.com/zl8JzZc.png')
      .setDescription(`\`\`\`md\n#Rd Pick Team Player\n${body.join('\n')}\`\`\``);
    const embeds: EmbedBuilder[] = [];
    embeds.push(embed);
    await interaction.reply({ embeds: embeds });
  },
};
