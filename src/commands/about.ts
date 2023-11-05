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
        iconURL: 'https://cdn.discordapp.com/avatars/535203406592344067/1473d566732ea6ffd24d02be45af8b21.png',
      })
      .setDescription(
        `**Stanley Bot** is developed by **[@conrmahr](https://github.com/conrmahr)** using the **[Discord.js](https://discord.js.org)** library.\nIssues and/or feature requests can be submitted through **[GitHub](https://github.com/conrmahr/stanley-bot)**.\n\n🤖 Stanley Bot v${process.env.STANLEY_VERSION}`
      );

    const supportButton = new ButtonBuilder()
      .setLabel('Sponsor')
      .setURL('https://github.com/sponsors/conrmahr')
      .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(supportButton);
    interaction.reply({ components: [row], embeds: [embed], ephemeral: false });
  },
};
