import { Validator } from 'wolf.js';
import { changePlace } from '../adhan/index.js';

/**
 * place command handler
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 * @returns {Promise<Awaited<boolean>>}
 */
export default async (client, command) => {
  if (Validator.isNullOrWhitespace(command.argument)) {
    await command.reply(command.getPhrase('pray_place_empty'));
    return Promise.resolve(false);
  }
  return changePlace(client, command);
};
