import 'dotenv/config.js';
import { AdhanClient } from './adhanClient.js';
import './db.js';
import logger from './utility/logger.js';

const clients = new Map();

/**
 * Main entry point for the application.
 * Reads accounts from environment variables, initializes Adhan clients,
 * and manages their lifecycle.
 */
const main = async () => {
  if (!process.env.ACCOUNTS) {
    throw new Error('ACCOUNTS environment variable is undefined or empty');
  }

  const accounts = process.env.ACCOUNTS.split('|');

  for (const account of accounts) {
    const [username, password, api_key] = account.split(':');

    if (!username || !password) continue;

    const client = new AdhanClient(username, password, api_key);
    clients.set(username, client);

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  for (const client of clients.values()) {
    client.setClients(clients);

    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

main()
  .then(() => {
    logger.info(`login to all bots ${clients.size}`);
  })
  .catch((e) => {
    logger.info(`main function error ${e}`);
    console.error(e);
  });
