/**
 * help command handler
 * @param {import('wolf.js').CommandContext} command
 * @returns {Promise<void>}
 */
export default async (command) => {
  return command.reply(command.getPhrase('help_message').join('\n'));
};
