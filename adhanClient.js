import { Command, WOLF, OnlineState } from 'wolf.js';
import { scheduleJob } from 'node-schedule';
import * as Adhan from './commands/index.js';
import job from './adhan/job.js';
import logger from './utility/logger.js';

/**
 * Adhan Client class extending WOLF bot.
 * Manages prayer time reminders and bot commands.
 */
export class AdhanClient extends WOLF {
  clients;
  email;

  /**
   * Creates an instance of AdhanClient.
   * @param {string} email - Bot email/username.
   * @param {string} password - Bot password.
   * @param {string} api_key - API Key.
   */
  constructor(email, password, api_key) {
    super();
    this.email = email;
    this.clients = null;

    // 1. Setup Event Listeners first
    this.on('loginSuccess', async (subscriber) => this.#loginSuccess(subscriber));
    this.on('loginFailed', (reason) => this.#loginFailed(reason));

    // 2. Register Commands
    this.#commandHandler();

    // 3. Initiate Login
    // We do not use .then() here because login() does not return a Promise
    logger.info(`Attempting login for ${this.email}...`);
    this.login(email, password, api_key, OnlineState.ONLINE);
  }

  #commandHandler() {
    this.commandHandler.register([
      // main command
      new Command(
        'main_command',
        { both: (command) => Adhan.Main(this, command) },
        [
          // place command
          new Command('place_command', {
            channel: (command) => Adhan.Place(this, command),
          }),
          // help command
          new Command('help_command', {
            channel: (command) => Adhan.Help(command),
          }),
          // remind command
          new Command('remind_command', {
            channel: (command) => Adhan.Remind(command),
          }),
          // join command
          new Command('join_command', {
            private: (command) => Adhan.Join(this, command, this.clients),
          }),
          // total command
          new Command('admin_total_command', {
            both: (command) => Adhan.Total(this, command),
          }),
        ],
      ),
    ]);
  }

  /**
   * Sets the list of all active clients.
   * @param {Map} clients - A map of all active AdhanClient instances.
   */
  setClients(clients) {
    this.clients = Array.from(clients.values());
  }

  /**
   * Callback for successful login.
   * Starts the cron job for checking prayer times.
   * @param {Object} subscriber - The subscriber object returned on login.
   * @returns {Promise<void>}
   */
  #loginSuccess(subscriber) {
    logger.info(`Login success for ${this.email} (${subscriber.id})`);
    scheduleJob('* * * * *', async () => job(this));
    return Promise.resolve();
  }

  /**
   * Callback for failed login.
   * @param {import('wolf.js').Response} reason - The failure reason.
   */
  #loginFailed(reason) {
    logger.error(`Login failed: ${reason.headers?.message || 'Unknown reason'}, ${this.email}`);
    return Promise.resolve();
  }
}
