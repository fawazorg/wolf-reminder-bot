import { Validator } from 'wolf.js';

/**
 * join command handler
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 * @returns {Promise<void>}
 */
export default async (client, command) => {
  const isDeveloper =
    command.sourceSubscriberId === client.config.framework.developer;
  const isAdmin = command.sourceSubscriberId === 5855;
  const ok = isDeveloper || isAdmin;
  if (!ok || !Validator.isValidNumber(command.argument)) {
    return Promise.resolve(false);
  }
  const phrase = command.getPhrase('join_messages');
  const res = await client.channel.joinById(parseInt(command.argument, 10));
  const text = phrase.find(
    (err) => err.code === res.code && err?.subCode === res.headers?.subCode,
  );
  return command.reply(text.msg);
};
