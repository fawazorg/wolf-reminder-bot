import { OnlineState, WOLF } from 'wolf.js';
import logger from './utility/logger.js';
import 'dotenv/config.js';

const client = new WOLF();

client.on('loginSuccess', (subscriber) => {
  logger.info(`[+] Login success: ${subscriber.id}`);
});

client.on('loginFailed', (res) => {
  logger.error(`[-] Login failed. Reason: ${res?.headers?.message}`);
});

client
  .login(process.env.EMAIL, process.env.PASSWORD, OnlineState.ONLINE)
  .then(() => {
    logger.info('[+] Try to login');
  })
  .catch((_error) => {
    logger.error(_error);
  });
