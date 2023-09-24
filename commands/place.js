import { Capability } from 'wolf.js';
import { changePlace } from '../adhan/index.js';

/**
 * place command handler
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 * @returns {Promise<void>}
 */
export default async (client, command) => {
  const isOwner = await command.hasCapability(Capability.OWNER, true, false);
  if (!isOwner) {
    return command.reply(command.getPhrase('error_command_not_authorized'));
  }
  return changePlace(client, command);
};
