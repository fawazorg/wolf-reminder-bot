import { toggleRemind } from '../adhan/index.js';

/**
 * remind command handler
 * @param {import('wolf.js').CommandContext} command
 * @returns {Promise<void>}
 */
export default async (command) => {
  await toggleRemind(command);
};
