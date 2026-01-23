<br />

<p align="center">
<a href="https://wolf.live/u/76117834">
  <img src="https://wolf.live/assets/images/wolf-brand/app-icon/wolf-128px.png" alt="Infected Logo" width="128">
</a>
</p>

<h3 align="center"><b>Adhan Bot</b></h3>
<p align="center"><b>PrayTime reminder Bot for <a href='https://wolf.live'>WOLF</a></b></p>

# Introduction

Adhan is a versatile prayer times calculation bot that caters to users from all regions of the world. With the ability to calculate prayer times based on various methods and customizable preferences, Adhan provides a seamless experience for users to manage their prayer timings.

## Features

- **Accurate Prayer Times:** Adhan calculates prayer times for all regions of the world, ensuring precision and reliability in its calculations.

- **Method Customization:** Users can choose their preferred method for calculating prayer times, allowing for flexibility in accordance with personal beliefs and preferences.

- **Automatic Reminders:** Adhan Bot offers the convenience of setting automatic reminders for prayer times, ensuring users are promptly notified.

## Installation
To install and set up Adhan bot, follow the instructions below:

1. **Clone the Repository**: Clone the Wolf Adhan repository from GitHub:
   ```bash
   git clone https://github.com/fawazorg/wolf-reminder-bot.git
   cd wolf-reminder-bot
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure the Bot**: Create a `.env` file in the project root directory. You can use `.env.example` as a template.
   ```bash
   cp .env.example .env
   ```
   
   **Environment Variables:**
   - `ACCOUNTS`: List of bot accounts in format `email:password:device_id|...`
   - `SLACK_HOOK`: Slack webhook URL for logs/notifications.
   - `HERE_APIKEY`: API key for location services.
   - `ROOT_USERNAME`: Admin username for database.
   - `ROOT_PASSWORD`: Admin password for database.
   - `ROOT_DATABASE`: Admin database name.
   - `MONGO_USER`: MongoDB username.
   - `MONGO_PWD`: MongoDB password.
   - `MONGO_DB_NAME`: MongoDB database name.

4. **Start the Bot**:
   Using Docker (Recommended):
   ```bash
   docker-compose up -d
   ```
   Or locally:
   ```bash
   npm start
   ```

**Congratulations!** Wolf Adhan is now successfully installed and ready to use on the [WOLF](https://wolflive.com) app.

## Commands

- `!Adhan`: Retrieve the prayer times for the current day based on the default settings.
- `!Adhan help`: Get information about available commands and how to use them.
- `!Adhan place`: Set or view location.
- `!Adhan remind`: Configure reminder settings.
- `!Adhan join`: Join a channel (private command).
- `!Adhan total`: View stats (admin).

## Contribute

Contributions to the Adhan bot project are welcome! If you're interested in contributing, follow these steps:

1. Fork the repository on GitHub.
2. Clone your forked repository and create a new branch: `git checkout -b feature/new-feature`
3. Make your changes, commit them, and push to your forked repository.
4. Create a pull request (PR).

For any issues, questions, or feedback, feel free to open an issue on the GitHub repository or contact the maintainers directly [@Fawaz](https://wolf.live/u/12500068).
