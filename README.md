# Weekly Notices
A simple Discord notification bot designed for weekly schedules

Requires node `8.11.1` or newer

## Install

```bash
git clone https://github.com/vegeta897/raid-notices.git
cd discord-syntax-test
npm install
```

## Configure

Set `TOKEN` env variable, or create a `.env` file with `TOKEN="your_token"`

Add your events and notifications to `schedule.json`

Customize the bot itself in `bot.json`

See [CONFIG.md](CONFIG.md) for details

Finally, `npm start`

You can reload the config files at any time by using `s.reload` (if your prefix is `s.`)

## Credits

Powered by [Eris](https://abal.moe/Eris/) and [Moment.js](https://momentjs.com/)

Originally created for Lillie
