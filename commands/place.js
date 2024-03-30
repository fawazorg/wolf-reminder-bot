import { Capability, Validator } from 'wolf.js';
import { changePlace } from '../adhan/index.js';

/**
 * place command handler
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 * @returns {Promise<Awaited<boolean>>}
 */
export default async (client, command) => {
  const channel = await client.channel.getById(command.sourceSubscriberId);
  const isOwner = channel.owner.id === command.sourceSubscriberId;
  if (!isOwner) {
    await command.reply(command.getPhrase('error_command_not_authorized'));
    return Promise.resolve(false);
  }
  if (Validator.isNullOrWhitespace(command.argument)) {
    await command.reply(command.getPhrase('pray_place_empty'));
    return Promise.resolve(false);
  }
  return changePlace(client, command);
};
