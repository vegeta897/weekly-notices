const Discord = require('./discord');

function createEmbedMessage (eventNotification) {
    let { event, notification, embedColor, embedAuthor } = eventNotification;
    let embed = {};
    embed.color = parseInt(embedColor, 16);
    if(embedAuthor) {
        embed.author = {
            name: embedAuthor
        };
    }
    embed.title = `📢 ${event.name} `;
    embed.fields = [
        {
            name: 'Notice',
            value: `This event ${createTimeDescription(notification)}`
        }
    ];
    if(notification.customMessage) {
        embed.fields.push({
            name: 'Info',
            value: notification.customMessage
        })
    }
    embed.footer = {
        text: event.name
    };
    embed.timestamp = event.time.format();
    return embed;
}

function createPlainMessage (eventNotification) {
    let { event, notification } = eventNotification;
    let message = `📢 **${event.name}** `;
    message += createTimeDescription(notification);
    if(notification.customMessage) {
        message += `\n${notification.customMessage}`;
    }
    return message;
}

function createTimeDescription ({ minutesBefore, secondsBefore }) {
    let description = '';
    let future = minutesBefore > 0 || secondsBefore > 0;
    let now = minutesBefore === 0 && secondsBefore === 0;
    let past = minutesBefore < 0 || secondsBefore < 0;
    minutesBefore = Math.abs(minutesBefore);
    secondsBefore = Math.abs(secondsBefore);
    if(now) {
        description += 'has begun'
    } else if(past) {
        description += 'began'
    } else if(future) {
        description += 'begins in'
    }
    if(minutesBefore > 0) {
        description += ` ${minutesBefore} minute${minutesBefore > 1 ? 's' : ''}`
    }
    if(secondsBefore > 0) {
        if(minutesBefore > 0) {
            description += ' and';
        }
        description += ` ${secondsBefore} second${secondsBefore > 1 ? 's' : ''}`
    }
    if(past) {
        description += ' ago';
    }
    return description;
}

module.exports = {
    sendNotification: async eventNotification => {
        let { useEmbeds, channels, notification: { roleMention } } = eventNotification;
        let content = {};
        if(useEmbeds) {
            content.embed = createEmbedMessage(eventNotification);
        } else {
            content.content = createPlainMessage(eventNotification);
        }
        for(let channel of channels) {
            let sendingContent = Object.assign({}, content);
            if(roleMention) {
                let roleMentionString = Discord.getRoleMention(channel, roleMention);
                if(sendingContent.content) {
                    sendingContent.content = `${roleMentionString}\n${sendingContent.content}`
                } else {
                    sendingContent.content = roleMentionString
                }
            }
            await Discord.createMessage(channel, sendingContent);
        }
    }
};
