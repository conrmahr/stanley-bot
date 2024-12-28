import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from 'discord.js';
import { getDefaultEmbed } from '../utils/embeds.js';

export default {
  data: new SlashCommandBuilder().setName('about').setDescription('Learn more about Stanley!'),
  async execute(interaction: ChatInputCommandInteraction) {
    const embed = getDefaultEmbed()
      .setAuthor({
        name: 'About',
        iconURL: interaction.client.user.avatarURL() ?? undefined,
      })
      .setDescription(
        `**stanley-bot** is developed by **[@conrmahr](https://github.com/conrmahr)** using the **[Discord.js](https://discord.js.org)** library.\nIssues and/or feature requests can be submitted through **[GitHub](https://github.com/conrmahr/stanley-bot/issues)**.\n\n🤖 Stanley Bot v0.2.0`
      );

    const supportButton = new ButtonBuilder()
      .setLabel('Sponsor')
      .setURL('https://github.com/sponsors/conrmahr')
      .setStyle(ButtonStyle.Link);

    const sponsorButton = new ButtonBuilder()
      .setLabel('Support')
      .setURL('https://bot.hockey/invite')
      .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(sponsorButton, supportButton);
    interaction.reply({ components: [row], embeds: [embed], ephemeral: true });
  },
};
