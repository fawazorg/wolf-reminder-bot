import moment from 'moment-timezone';
import Channel from '../models/channel.js';
import PrayTimes, { dateToTimeZone } from '../utility/PrayTimes.js';
import { defaultCity } from './index.js';
import logger from '../utility/logger.js';

const castLanguage = (language) => {
  return language === 14 ? 'ar' : 'en';
};
const isNow = (time) => {
  return (
    Math.round(moment.duration(moment(time).diff(moment())).asMinutes()) === 1
  );
};

const sendAlert = async (client, channel) => {
  try {
    const prayTime = PrayTimes(
      channel.city.lat,
      channel.city.long,
      channel.method,
    );
    const language = castLanguage(channel.extended.language);
    const prayPhrase = client.phrase.getByLanguageAndName(
      language,
      'pray_time',
    );
    if (prayTime.nextPrayer() === 'none') {
      return Promise.resolve();
    }
    if (!isNow(prayTime[prayTime.nextPrayer()])) {
      return Promise.resolve();
    }
    const phrase = client.phrase.getByLanguageAndName(
      language,
      'pray_time_now',
    );
    return client.messaging.sendChannelMessage(
      channel.id,
      client.utility.string.replace(phrase, {
        city: channel.city.name,
        pray: prayPhrase[prayTime.nextPrayer()],
        time: dateToTimeZone(
          prayTime[prayTime.nextPrayer()],
          channel.city.timeZone,
          language,
        ),
      }),
    );
  } catch (e) {
    logger.error(e);
  }
};
/**
 *
 * @param {import('wolf.js').WOLF} client
 * @returns {Promise<void>}
 */
export default async (client) => {
  try {
    const channels = await client.channel.list();
    await channels.reduce(async (previousValue, currentValue) => {
      await previousValue;
      const channel = await Channel.findOne({ cid: currentValue.id });
      if (channel) {
        // eslint-disable-next-line no-underscore-dangle
        return sendAlert(client, { ...channel._doc, ...currentValue });
      }
      return sendAlert(client, { ...defaultCity, ...currentValue });
    }, Promise.resolve());
  } catch (e) {
    logger.error(e);
  }
};
