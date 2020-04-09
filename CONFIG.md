# 🛠️ Configuration

## Schedule

The `schedule.json` file contains your scheduling data, which consists of two parts:

1. **Events** - An array of events that occur each week
2. **Notifications** - An array of timed notifications that occur for every event

There's also the `timezone` property, so the bot can correctly read your configured times. This must be a valid [IANA](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) name (e.g. `America/New_York`, `Europe/London`, `Japan`).

### Events

Every event object must look like the following:

```json
{
  "name": "Tuesday night boss",
  "weekday": "tuesday",
  "hour": 20,
  "minute": 0
}
```
The `name` will be shown in the notification. The `hour` must be in 24-hour format, so 10PM at night would be `"hour": 22`

Don't forget to separate your event objects with a comma. [Validate your JSON!](https://jsonlint.com/)

### Notifications

Notification objects consist entirely of optional properties:

```json
{
  "minutesBefore": 10,
  "secondsBefore": 0,
  "roleMention": "everyone",
  "customMessage": "This is the final notice!"
}
```

This notification will trigger 30 minutes before every event, because it has `minutesBefore` set to `30`. You can also use `secondsBefore`, which will add with the minutes. These properties will default to `0` if not set (which causes a notification precisely when the event starts)

You can make the notification mention a @role with `roleMention`. You can use `everyone`, `here`, or the name of any mentionable role. Do not include `@` in the role name.

Lastly, you can attach a custom message to the notification. This will display in addition to the event name and how many minutes/seconds away it is.

## Bot

The `bot.json` file allows you to specify admins, target channels, and customize the rich embed.

`channels` is a list of channel IDs which the bot will send notifications to. These can be across different servers, but this bot is more suited for single-server usage. These IDs must be in string format, e.g. `"522278186147512322"`

`useEmbeds` specifies whether you want notification messages to use rich embeds. Set it to `false` to use plain text messages, which are smaller and visible to users who have turned off embeds.

If you are using embeds, you can customize the color and author name with `embedColor` and `embedAuthor`. The color must be a 6-digit hex value, like this `F04F6F`. Do not include `#` or `0x` in this value.

There is only one chat command, which is `s.reload`, but you can customize the prefix.

`admins` is an array of user IDs that have permission to use the reload command.
