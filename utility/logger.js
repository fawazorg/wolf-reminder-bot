import { createLogger, format, transports } from 'winston';
import SlackHook from 'winston-slack-webhook-transport';
import 'dotenv/config.js';
import moment from 'moment-timezone';

export default createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    // new transports.File({ level: 'error', filename: './logs/error.log' }),
    // new transports.File({ filename: './logs/combined.log' }),
    new transports.Console({
      format: format.combine(
        format.colorize({ all: true }),
        format.simple(),
        format.printf(({ level, message }) => {
          return `${moment().format('YY.MM.DD HH:mm')} [${level}]: ${message}`;
        }),
      ),
    }),
    new SlackHook({
      mrkdwn: true,
      level: 'error',
      channel: 'prods',
      username: 'Reminder',
      webhookUrl: process.env.SLACK_HOOK,
      iconUrl: 'https://palringo.com/avatar.php?id=76117834',
      iconEmoji: 'https://palringo.com/avatar.php?id=76117834',
      formatter: (info) => ({
        text: `🚨 *${info.level.toUpperCase()}* \n\n🗓 Time: _${moment().format(
          'YY.MM.DD HH:mm',
        )}_\n\n> ${info.message}`,
      }),
    }),
  ],
});
