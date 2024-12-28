import { Events } from 'discord.js';

export default {
  event: Events.Error,
  once: true,
  execute(error: Error) {
    console.error(`Error: ${error.message}`);
  },
};
