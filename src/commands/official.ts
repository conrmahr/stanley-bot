import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, AutocompleteInteraction } from 'discord.js';
import { getDefaultEmbed } from '../utils/embeds.js';
import { getGameBoxscore } from '../api/nhle.js';
import { getOfficials } from '../api/records.js';
import { sliceLimit, formatGameDate } from '../utils/helpers.js';

export default {
  data: new SlashCommandBuilder()
    .setName('official')
    .setDescription('Get official by name or number.')
    .addStringOption((option) => option.setName('name').setDescription('Name').setAutocomplete(true).setRequired(true)),
  async autocomplete(interaction: AutocompleteInteraction) {
    let choices: { name: string; value: string }[] = [];
    const focusedOption: { name: string; value: string } = interaction.options.getFocused(true);
    const officials = await getOfficials({ active: true });

    const officialsFocused: string[] = officials
      .filter(
        (official: { firstName: string; lastName: string; sweaterNumber: string }) =>
          `${official.firstName} ${official.lastName}`.toLowerCase().includes(focusedOption.value.toLowerCase()) ||
          official.sweaterNumber.toString().includes(focusedOption.value)
      )
      .sort((a: { sweaterNumber: number }, b: { sweaterNumber: number }) => {
        return a.sweaterNumber - b.sweaterNumber;
      });

    const officialsFiltered = sliceLimit(officialsFocused);

    choices = officialsFiltered.map((official) => ({
      name: `#${official.sweaterNumber} ${official.firstName} ${official.lastName} (${official.officialType})`,
      value: `${official.id}`,
    }));

    await interaction.respond(choices);
  },
  async execute(interaction: ChatInputCommandInteraction) {
    const inputId = interaction.options.getString('name') ?? undefined;
    const data = await getOfficials({ id: inputId });
    const [bio] = data.length ? data : ['No officials results'];

    const firstRegularGameDate = await getGameBoxscore({ id: bio.firstRegularGameId });

    const firstPlayoffGameDate = await getGameBoxscore({ id: bio.firstPlayoffGameId });

    const embed = getDefaultEmbed()
      .setAuthor({
        name: `${bio.firstName} ${bio.lastName} #${bio.sweaterNumber}`,
        url: bio.associationUrl,
        iconURL: 'https://i.imgur.com/zl8JzZc.png',
      })
      .setThumbnail(bio.thumb_url)
      .setDescription(`${bio.officialType} | ${bio.birthCity}, ${bio.stateProvinceCode}, ${bio.nationalityCode}`)
      .addFields(
        { name: 'First Regular Game', value: formatGameDate(firstRegularGameDate.gameDate), inline: true },
        { name: 'First Playoff Game', value: formatGameDate(firstPlayoffGameDate.gameDate), inline: true }
      );
    const embeds: EmbedBuilder[] = [];
    embeds.push(embed);
    await interaction.reply({ embeds: embeds });
  },
};
