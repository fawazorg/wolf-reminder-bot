import Channel from '../models/channel.js';
import PrayTimes, { dateToTimeZone } from '../utility/PrayTimes.js';
import search from '../utility/geocode.js';
import logger from '../utility/logger.js';

export const defaultCity = {
  notify: true,
  method: 'UmmAlQura',
  city: {
    lat: 21.42251,
    long: 39.826168,
    name: 'مكة المكرمة',
    timeZone: 'Asia/Riyadh',
  },
};
/**
 * Get all pray times
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 */
const getAllPrayTimes = async (client, command) => {
  try {
    let channel = await Channel.findOne({ cid: command.targetChannelId });
    if (!channel) {
      channel = defaultCity;
    }
    const times = PrayTimes(
      channel.city.lat,
      channel.city.long,
      channel.method,
    );
    const prayText = command.getPhrase('pray_time_title');
    const prayPhrase = command.getPhrase('pray_time');
    let list = '';
    Object.keys(prayPhrase).forEach((key) => {
      list += `- ${prayPhrase[key]} : ${dateToTimeZone(
        times[key],
        channel.city.timeZone,
        command.language,
      )}\n`;
    });
    await command.reply(
      client.utility.string.replace(prayText, {
        list,
        city: channel.city.name,
      }),
    );
  } catch (e) {
    logger.error(e);
  }
};
/**
 * change the place
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 */
const changePlace = async (client, command) => {
  try {
    const item = await search(command.argument, command.language);
    if (item) {
      await Channel.findOneAndUpdate(
        { cid: command.targetChannelId },
        {
          method: defaultCity.method,
          city: {
            lat: item.position.lat,
            long: item.position.lng,
            name: item.address.label,
            timeZone: item.timeZone.name,
          },
        },
        { upsert: true },
      );
      return command.reply(
        client.utility.string.replace(command.getPhrase('pray_place_success'), {
          city: item.address.label,
        }),
      );
    }
    return command.reply(
      client.utility.string.replace(command.getPhrase('pray_place_failed'), {
        city: command.argument,
      }),
    );
  } catch (e) {
    logger.error(e);
  }
};
/**
 *
 * @param {import('wolf.js').CommandContext} command
 * @returns {Promise<void>}
 */
const toggleRemind = async (command) => {
  try {
    const channel = await Channel.findOneAndUpdate(
      { cid: command.targetChannelId },
      [{ $set: { notify: { $not: '$notify' } } }],
      { upsert: true },
    );
    if (channel?.notify) {
      await command.reply(command.getPhrase('remind_enabled'));
    } else {
      await command.reply(command.getPhrase('remind_disabled'));
    }
  } catch (e) {
    logger.error(e);
  }
};

export { getAllPrayTimes, changePlace, toggleRemind };
