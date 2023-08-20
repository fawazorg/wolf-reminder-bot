import { changePlace } from '../adhan/index.js';

/**
 * place command handler
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 * @returns {Promise<void>}
 */
export default async (client, command) => {
  await changePlace(client, command);
};
