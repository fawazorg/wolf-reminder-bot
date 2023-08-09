import { OnlineState, WOLF } from 'wolf.js';

import 'dotenv/config.js';

const client = new WOLF();

client.on('loginSuccess', (subscriber) => {
  console.info(`[+] Login success: ${subscriber.id}`);
});

client.on('loginFailed', (res) => {
  console.error(`[-] Login failed. Reason: ${res?.headers?.message}`);
});

client
  .login(process.env.EMAIL, process.env.PASSWORD, OnlineState.ONLINE)
  .then(() => {
    console.info('[+] Try to login');
  })
  .catch((_error) => {
    console.error(_error);
  });
