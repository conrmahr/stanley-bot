import { BaseInteraction, Events, MessageFlags } from 'discord.js';
import { Client } from '../types';

export default {
  event: Events.InteractionCreate,
  once: false,
  async execute(interaction: BaseInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const client: Client = interaction.client;

    const command = client.commands!.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    const commandActivity = {
      server: interaction.guild?.name,
      serverId: interaction.guild?.id,
      count: interaction.guild?.memberCount,
      command: `${interaction ?? ''}`,
    };

    try {
      if (process.env.DEBUG) console.log(commandActivity);
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
    }
  },
};
