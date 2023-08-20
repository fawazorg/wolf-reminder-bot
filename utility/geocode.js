import axios from 'axios';

import 'dotenv/config.js';
import logger from './logger.js';

const search = async (q, lang = 'ar') => {
  try {
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
    return data?.items[0];
  } catch (_error) {
    logger.error('GeoCode request error: ', _error?.message);
    return false;
  }
};

export default search;
