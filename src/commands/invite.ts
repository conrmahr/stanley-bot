import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getDefaultEmbed } from '../utils/embeds.js';

export default {
  data: new SlashCommandBuilder().setName('invite').setDescription('Invite Stanley to your server!'),
  async execute(interaction: ChatInputCommandInteraction) {
    const embed = getDefaultEmbed()
      .setImage('https://assets.nhle.com/logos/nhl/svg/CBJ_light.svg')
      .setThumbnail('https://assets.nhle.com/logos/nhl/svg/CBJ_light.svg')
      .setAuthor({
        name: 'Invite',
        iconURL: 'https://cdn.discordapp.com/avatars/535203406592344067/1473d566732ea6ffd24d02be45af8b21.png',
      })
      .setDescription(`Here are some helpful links:`)
      .addFields(
        {
          name: 'Add to Server',
          value: '[Invite staleny-bot to Your Server](https://bot.hockey/invite)',
        },
        {
          name: 'Join',
          value: '[Join the Support Server](https://bot.hockey/join)',
        },
        {
          name: 'Contribute',
          value: '[Contribute to stanley-bot on GitHub](https://git.io/stanley-bot)',
        },
        {
          name: 'Sponsor',
          value: '[Sponsor author on GitHub](https://github.com/sponsors/conrmahr)',
        }
      );

    interaction.reply({ embeds: [embed], ephemeral: false });
  },
};
