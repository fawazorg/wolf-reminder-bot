import { Validator } from 'wolf.js';
import { admins, channelAdminId } from '../../config/app.js';

/**
 * sort clients by channels count
 * @param {import('adhanClient.js').AdhanClient[]} clients
 * @returns {import('adhanClient.js').AdhanClient}
 */
const minChannels = async (clients) => {
  let min = Infinity;
  let minClient = null;

  // eslint-disable-next-line no-restricted-syntax
  for (const client of clients) {
    const channelsCount = (await client.channel.list()).length;

    if (channelsCount < min) {
      minClient = client;
      min = channelsCount;
    }
  }

  return minClient;
};
/**
 * validate groupID
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 * @returns {Promise<Awaited<boolean>>}
 */
const validateGroupId = async (client, command) => {
  const groupId = client.utility.number.toEnglishNumbers(command.argument);

  if (Validator.isValidNumber(groupId, false)) {
    return Promise.resolve(true);
  }
  await command.reply(
    client.phrase.getByCommandAndName(command, 'error_channel_id_not_valid'),
  );

  return Promise.resolve(false);
};
/**
 * check if bot in bots channels
 * @param {number} channelId
 * @param {import('adhanClient.js').AdhanClient[]} clients
 * @returns {Promise<boolean>}
 */
const botInChannel = async (channelId, clients) => {
  const allChannels = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const client of clients) {
    const channels = await client.channel.list();
    allChannels.push(...channels);
  }
  const exist = allChannels.find((channel) => channel.id === channelId);
  return !!exist;
};
/**
 * join command handler
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 * @param {import('adhanClient.js').AdhanClient[]} clients
 * @returns {Promise<boolean>}
 */
export default async (client, command, clients) => {
  const isAdmin = admins.includes(command.sourceSubscriberId);
  if (!isAdmin) {
    return Promise.resolve(false);
  }
  const IsChannelIdIsValid = await validateGroupId(client, command);
  if (!IsChannelIdIsValid) {
    return Promise.resolve(false);
  }
  const canJoin = await botInChannel(parseInt(command.argument, 10), clients);
  if (canJoin) {
    const phrase = command.getPhrase('error_can_not_join');
    await command.reply(phrase);
    return Promise.resolve(false);
  }
  const minClient = await minChannels(clients);
  const phrase = Array.from(command.getPhrase('join_messages'));
  const res = await minClient.channel.joinById(parseInt(command.argument, 10));
  const text = phrase.find(
    (err) => err.code === res.code && err?.subCode === res.headers?.subCode,
  );
  if (res.code === 200) {
    const joinLogPhrase = command.getPhrase('join_log_message');
    const joinLogText = minClient.utility.string.replace(joinLogPhrase, {
      channelId: command.argument,
      id: command.sourceSubscriberId,
      nickname: (await minClient.subscriber.getById(command.sourceSubscriberId))
        .nickname,
      channelName: (
        await minClient.channel.getById(parseInt(command.argument, 10))
      ).name,
    });
    await minClient.messaging.sendChannelMessage(channelAdminId, joinLogText);
  }
  await command.reply(text.msg);
  return Promise.resolve(true);
};
