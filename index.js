import 'dotenv/config.js';
import './db.js';
import { AdhanClient } from './adhanClient.js';
import logger from './utility/logger.js';

const clients = new Map();
const accounts = process.env.ACCOUNTS.split('|');
const main = async () => {
  await accounts.reduce(async (previousValue, account) => {
    await previousValue;

    const client = new AdhanClient(
      account.split(':')[0],
      account.split(':')[1],
    );

    clients.set(account.split(':')[0], client);
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  }, Promise.resolve());

  await Array.from(clients.values()).reduce(async (previousValue, client) => {
    await previousValue;
    client.setClients(clients);
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
  }, Promise.resolve());

  return Promise.resolve();
};

main()
  .then(() => {
    logger.info(`login to all bots ${clients.size}`);
  })
  .catch((e) => {
    logger.info(`main function error ${e}`);
  });
