import 'dotenv/config.js';
import './db.js';
import { AdhanClient } from './adhanClient.js';

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

  return Promise.resolve();
};

main()
  .then(() => {
    console.log(`[Connected] all ${clients.size} bots`);
  })
  .catch((e) => {
    console.log(`[Error] error ${e}`);
  });

export default clients;
