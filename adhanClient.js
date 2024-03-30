import { Command, WOLF } from 'wolf.js';
import { scheduleJob } from 'node-schedule';
import * as Adhan from './commands/index.js';
import job from './adhan/job.js';
import logger from './utility/logger.js';

export class AdhanClient extends WOLF {
  clients;

  email;

  constructor(email, password) {
    super();
    this.email = email;
    this.login(email, password)
      .then(() => logger.info('try to login'))
      .catch((e) => logger.error(`login error : ${e}`));
    this.on('loginSuccess', async () => this.#loginSuccess());
    this.on('loginFailed', (reason) => this.#loginFailed(reason));
    this.#commandHandler();
    this.clients = null;
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
   *
   */
  setClients(clients) {
    this.clients = Array.from(clients.values());
  }

  /**
   * login handler
   * @returns {Promise<void>}
   */
  #loginSuccess() {
    scheduleJob('* * * * *', async () => job(this));
    return Promise.resolve();
  }

  /**
   *
   * @param {import('wolf.js').Response} reason
   */
  #loginFailed(reason) {
    logger.error(`login failed: ${reason.headers?.message}, ${this.email}`);
    return Promise.resolve();
  }
}
