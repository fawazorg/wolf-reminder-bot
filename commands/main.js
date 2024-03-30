import { getAllPrayTimes } from '../adhan/index.js';

/**
 * main command handler
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 * @returns {Promise<Awaited<boolean>>}
 */
export default async (client, command) => {
  if (!command.isChannel) {
    return Promise.resolve(false);
  }
  await getAllPrayTimes(client, command);
  return Promise.resolve(true);
};
