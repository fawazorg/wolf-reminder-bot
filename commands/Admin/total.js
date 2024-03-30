import { channelAdminId } from '../../config/app.js';

/**
 * admin total command handler
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 * @returns {Promise<Awaited<boolean>>}
 */
export default async (client, command) => {
  if (command.isChannel && command.targetChannelId !== channelAdminId) {
    const helpPhrase = Array.from(command.getPhrase('help_message')).join('\n');
    await command.reply(helpPhrase);
    return Promise.resolve(false);
  }
  const channelTotal = (await client.channel.list()).length;
  const phrase = command.getPhrase('admin_count_message');
  const text = client.utility.string.replace(phrase, { count: channelTotal });
  await command.reply(text);
  return Promise.resolve(true);
};
