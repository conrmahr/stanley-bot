import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, AutocompleteInteraction } from 'discord.js';
import { getDefaultEmbed } from '../utils/embeds.js';
import { getDraft } from '../api/records.js';
import { getTeamsList, getDraftList } from '../api/nhle.js';
import { sliceLimit } from '../utils/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('draft')
    .setDescription('Get draft picks by round or team.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('round')
        .setDescription('Draft round')
        .addStringOption((option) => option.setName('round').setDescription('Filter on round').setAutocomplete(true))
        .addStringOption((option) => option.setName('year').setDescription('Draft Year').setAutocomplete(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('team')
        .setDescription('Draft team')
        .addStringOption((option) =>
          option.setName('team').setDescription('Filter on team').setAutocomplete(true).setRequired(true)
        )
        .addStringOption((option) => option.setName('year').setDescription('Draft Year').setAutocomplete(true))
    ),
  async autocomplete(interaction: AutocompleteInteraction) {
    let choices: { name: string; value: string }[] = [];
    const focusedOption: { name: string; value: string } = interaction.options.getFocused(true);

    if (focusedOption.name === 'year') {
      const drafts = await getDraftList();
      const draftFocused: string[] = drafts
        .filter(
          (year: { draftYear: string | string[]; rounds: number }) =>
            year.draftYear.toString().includes(focusedOption.value) && year.rounds > 1
        )
        .sort((a: { draftYear: number }, b: { draftYear: number }) => {
          return b.draftYear - a.draftYear;
        });

      const draftFiltered = sliceLimit(draftFocused);

      choices = draftFiltered.map((draft) => ({
        name: `${draft.draftYear} (${draft.rounds} Rounds)`,
        value: `${draft.draftYear}`,
      }));
    }

    if (focusedOption.name === 'round') {
      let i = 1;
      while (i < 26) {
        choices.push({ name: `Round ${i}`, value: i.toString() });
        i++;
      }
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
    const years = await getDraftList();

    const current = years.pop().draftYear.toString();
    const inputYear = interaction.options.getString('year') ?? current;
    const inputRound = interaction.options.getString('round') ?? '1';
    const inputTeam = interaction.options.getString('team') ?? null;

    const draft = await getDraft({ draftYear: inputYear, draftedByTeamId: inputTeam });

    const byTeamOrRound = inputTeam
      ? draft
      : draft.filter((player: { roundNumber: string }) => player.roundNumber.toString() === inputRound);

    const fields = byTeamOrRound.map(
      (field: { roundNumber: number; overallPickNumber: number; triCode: string; playerName: string }) =>
        `${field.roundNumber} ${field.overallPickNumber} ${field.triCode} ${field.playerName}`
    );

    const body = fields.length > 0 ? fields : ['No draft results'];
    const embed = getDefaultEmbed()
      .setAuthor({
        name: `${inputYear} NHL Entry Draft`,
        iconURL: 'https://i.imgur.com/zl8JzZc.png',
      })
      .setThumbnail('https://i.imgur.com/zl8JzZc.png')
      .setDescription(`\`\`\`md\n#Rd Pick Team Player\n${body.join('\n')}\`\`\``);
    const embeds: EmbedBuilder[] = [];
    embeds.push(embed);
    await interaction.reply({ embeds: embeds });
  },
};
