import { Command, WOLF } from 'wolf.js';
import { scheduleJob } from 'node-schedule';
import * as Adhan from './commands/index.js';
import job from './adhan/job.js';

export class AdhanClient extends WOLF {
  constructor(email, password) {
    super();
    this.login(email, password);
    this.on('loginSuccess', async (user) => this.#loginSuccess(user));
    this.on('loginFailed', (reason) => this.#loginFailed(reason));
    this.#commandHandler();
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
          // Join command
          new Command('join_command', {
            private: (command) => Adhan.Join(this, command),
          }),
        ],
      ),
    ]);
  }

  /**
   * login handler
   * @param {import('wolf.js').Subscriber} subscriber
   * @returns {Promise<void>}
   */
  #loginSuccess(subscriber) {
    console.log(subscriber.id);
    scheduleJob('* * * * *', async () => job(this));
    return Promise.resolve();
  }

  /**
   *
   * @param {import('wolf.js').Response} reason
   */
  #loginFailed(reason) {
    console.log(reason.body);
    return Promise.resolve();
  }
}
