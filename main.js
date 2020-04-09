require('dotenv').config();
const Discord = require('./bot/discord');
const ConfigLoader = require('./bot/config-loader');
const Scheduler = require('./bot/scheduler');
const Messaging = require('./bot/messaging');

const botSchemaPath = './bot/bot-schema.json';
const scheduleSchemaPath = './bot/schedule-schema.json';

let botConfig;
let schedule;

async function startup () {
    botConfig = await ConfigLoader
        .load(botSchemaPath, './bot.json');
    schedule = await ConfigLoader
        .load(scheduleSchemaPath, './schedule.json');
    Scheduler.init({
        ...schedule,
        onNotify: eventNotification => {
            Messaging.sendNotification({
                ...botConfig,
                ...eventNotification
            })
                .then()
                .catch(e => {
                    console.log('Error sending event notification:', e.message);
                });
        }
    });
}

Discord.onMessage(async message => {
    if(!botConfig.admins.includes(message.author.id)) {
        return;
    }
    if(message.content.toLowerCase() === botConfig.prefix + 'reload') {
        let response;
        try {
            await startup();
            response = '✔️ Config files successfully reloaded';
        } catch(e) {
            console.log(e);
            response = '⚠️ Config files failed to reload, see log for details';
        }
        try {
            await Discord.createMessage(message.channel.id, response);
        } catch(e) {
            console.log(e);
        }
    }
});

Discord.onReady(() => {
    startup()
        .then()
        .catch(console.log);
});

Discord.start()
    .then()
    .catch(console.log);
