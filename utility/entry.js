import { MessageType, Validator } from 'wolf.js';

import cache from './cache.js';

const skip = (id) => {
  const user = cache.get(id);

  user.skip = true;
};
/**
 *
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 * @param {String} question
 * @param {Boolean} inChannel
 * @param {String} type
 * @param {any} value
 * @returns {Promise<any>}
 */
const ask = async (client, command, question, inChannel, type, value = []) => {
  if (inChannel) {
    await client.messaging.sendChannelMessage(
      command.targetChannelId,
      question,
    );
  } else {
    await client.messaging.sendPrivateMessage(
      command.sourceSubscriberId,
      question,
    );
  }

  let exit = false;
  let nextMessage = null;
  let data = null;

  while (!exit) {
    if (inChannel) {
      nextMessage =
        await client.messaging.subscription.nextChannelSubscriberMessage(
          command.targetChannelId,
          command.sourceSubscriberId,
          2 * 60 * 1000,
        );
    } else {
      nextMessage = await client.messaging.subscription.nextPrivateMessage(
        command.sourceSubscriberId,
        2 * 60 * 1000,
      );
    }

    if (nextMessage) {
      data = await validate(client, command, nextMessage, type, value);
      exit = data.exit;
    } else {
      const phrase = command.getPhrase('error_timeUp');

      if (inChannel) {
        await client.messaging.sendChannelMessage(
          command.targetChannelId,
          phrase,
        );
      } else {
        await client.messaging.sendPrivateMessage(
          command.sourceSubscriberId,
          phrase,
        );
      }
      exit = true;
    }
  }

  if (nextMessage) {
    return data.results;
  }
  skip(command.sourceSubscriberId);
};
/**
 *
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 * @param {import('../report/entry.js').reportEntry | import('../report/entry.js').closeEntry} entry
 * @param {Object} questions
 * @param {Boolean} inChannel
 * @param {Object} newEntry
 * @return {Promise<Object>}
 */
const loopEntry = async (
  client,
  command,
  entry,
  questions,
  inChannel = false,
  newEntry = {},
) => {
  for (let i = 0; i < entry.length; i++) {
    const user = cache.get(command.sourceSubscriberId);

    if (user.skip) {
      break;
    }

    const e = entry[i];

    if (e.type === 'enum') {
      const answer = await ask(
        client,
        command,
        questions[e.name],
        inChannel,
        'enum',
        e.value.map((item) => item.path),
      );

      newEntry[e.name] = answer;

      const path = e.value.find((c) => c.path === parseInt(answer, 10));

      await loopEntry(client, command, [path], questions, inChannel, newEntry);

      if (e.break) {
        break;
      }
    } else if (e.type === 'collection') {
      await loopEntry(client, command, e.value, questions, inChannel, newEntry);
    } else {
      newEntry[e.name] = await ask(
        client,
        command,
        questions[e.name],
        inChannel,
        e.type,
      );
    }
  }

  return newEntry;
};
/**
 *
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 * @param {import('wolf.js').Message} message
 * @returns {Promise<number | boolean>}
 */
const isNumber = async (client, command, message) => {
  const n = parseInt(client.utility.number.toEnglishNumbers(message.body), 10);
  const ok =
    Validator.isValidNumber(n, false) && !Validator.isLessThanOrEqualZero(n);

  if (ok) {
    return n;
  }
  const phrase = command.getPhrase('error_not_number');

  await client.messaging.sendPrivateMessage(command.sourceSubscriberId, phrase);

  return false;
};
/**
 *
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 * @param {import('wolf.js').Message} message
 * @returns {Promise<{exit: boolean, results}|{exit: boolean}>}
 */
const isUser = async (client, command, message) => {
  const n = await isNumber(client, command, message);

  if (!n) {
    return {
      exit: false,
    };
  }

  const user = await client.subscriber.getById(n);

  if (user.exists) {
    return {
      exit: true,
      results: user.id,
    };
  }
  const phrase = command.getPhrase('error_user_notfound');

  await message.reply(phrase);

  return {
    exit: false,
  };
};
/**
 *
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 * @param {import('wolf.js').Message} message
 * @returns {Promise<{exit: boolean, results}|{exit: boolean}>}
 */
const isGroup = async (client, command, message) => {
  const n = await isNumber(client, command, message);

  if (!n) {
    return {
      exit: false,
    };
  }

  const group = await client.channel.getById(n);

  if (group.exists) {
    return {
      exit: true,
      results: group.id,
    };
  }
  const phrase = command.getPhrase('error_group_notfound');

  await message.reply(phrase);

  return {
    exit: false,
  };
};
/**
 *
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 * @param {import('wolf.js').Message} message
 * @param {any[]} value
 * @returns {Promise<{exit: boolean, results: (number|boolean)}|{exit: boolean}>}
 */
const isEnum = async (client, command, message, value = []) => {
  const n = await isNumber(client, command, message);

  if (!n) {
    return {
      exit: false,
    };
  }

  const ok = value.includes(n);

  if (ok) {
    return {
      exit: true,
      results: n,
    };
  }
  const phrase = command.getPhrase('error_enum_notfound');
  const text = client.utility.string.replace(phrase, {
    values: value.join(','),
  });

  await message.reply(text);

  return {
    exit: false,
  };
};
/**
 *
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 * @param {import('wolf.js').Message} message
 * @returns {Promise<{exit: boolean, results: boolean}|{exit: boolean}>}
 */
const isBoolean = async (client, command, message) => {
  const choices = command.getPhrase('entry_choices');
  const ok = Object.values(choices).includes(message.body);

  if (!ok) {
    const phrase = command.getPhrase('error_enum_notfound');
    const text = client.utility.string.replace(phrase, {
      values: Object.values(choices).join('/'),
    });

    await message.reply(text);

    return {
      exit: false,
    };
  }

  return {
    exit: true,
    results:
      Object.keys(choices).find((key) => choices[key] === message.body) === 'T',
  };
};
/**
 *
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 * @param {import('wolf.js').Message} message
 * @returns {Promise<{exit: boolean, results}|{exit: boolean}>}
 */
const isImage = async (client, command, message) => {
  const ok = message.type === MessageType.TEXT_IMAGE;

  if (!ok) {
    const phrase = command.getPhrase('error_not_image');

    await message.reply(phrase);

    return {
      exit: false,
    };
  }

  return {
    exit: true,
    results: message.body,
  };
};
/**
 *
 * @param {import('wolf.js').WOLF} client
 * @param {import('wolf.js').CommandContext} command
 * @param {import('wolf.js').Message} message
 * @param {String} type
 * @param {any} value
 * @returns {Promise<{exit: boolean, results}|{exit: boolean}|{exit: boolean, results: *}|{exit: boolean}|{exit: boolean}|{exit: boolean, results: number|boolean}|{exit: boolean}|{exit: boolean}|{exit: boolean, results: *}|{exit: boolean}|{exit: boolean, results: boolean}>}
 */
const validate = async (client, command, message, type, value = []) => {
  switch (type) {
    case 'group':
      return isGroup(client, command, message);
    case 'user':
      return isUser(client, command, message);
    case 'boolean':
      return isBoolean(client, command, message);
    case 'image':
      return isImage(client, command, message);
    case 'enum':
      return isEnum(client, command, message, value);
    default:
      return {
        exit: true,
        results: message.body,
      };
  }
};

export { loopEntry };
