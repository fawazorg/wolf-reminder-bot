import axios from 'axios';

import 'dotenv/config.js';
import { Validator } from 'wolf.js';
import logger from './logger.js';
import cache from './cache.js';

const search = async (q = '', lang = 'ar') => {
  try {
    if (Validator.isNullOrWhitespace(q)) {
      throw new Error('Query empty');
    }
    if (cache.has(q)) {
      return cache.get(q);
    }
    const { data } = await axios.get(
      'https://geocode.search.hereapi.com/v1/geocode',
      {
        params: {
          q,
          lang,
          limit: 1,
          show: 'tz',
          apiKey: process.env.HERE_APIKEY,
        },
      },
    );
    cache.set(q, data?.items[0]);
    return data?.items[0];
  } catch (_error) {
    logger.error('GeoCode request error: ', _error?.message);
    return false;
  }
};

export default search;
