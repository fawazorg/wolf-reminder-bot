import { Command, OnlineState, WOLF } from 'wolf.js';
import { scheduleJob } from 'node-schedule';
import logger from './utility/logger.js';

import 'dotenv/config.js';
import './db.js';
import * as Adhan from './commands/index.js';
import job from './adhan/job.js';

const client = new WOLF();

client.commandHandler.register([
  // main command
  new Command(
    'main_command',
    { channel: (command) => Adhan.Main(client, command) },
    [
      // place command
      new Command('place_command', {
        channel: (command) => Adhan.Place(client, command),
      }),
      // help command
      new Command('help_command', {
        channel: (command) => Adhan.Help(command),
      }),
      // remind command
      new Command('remind_command', {
        channel: (command) => Adhan.Remind(command),
      }),
    ],
  ),
]);

client.on('loginSuccess', async (subscriber) => {
  logger.info(`Login success: ${subscriber.id}`);
  scheduleJob('* * * * *', async () => job(client));
});

client.on('loginFailed', (res) => {
  logger.error(`Login failed. Reason: ${res?.headers?.message}`);
});

client
  .login(process.env.EMAIL, process.env.PASSWORD, OnlineState.ONLINE)
  .then(() => {
    logger.info('Try to login');
  })
  .catch((_error) => {
    logger.error(_error);
  });
