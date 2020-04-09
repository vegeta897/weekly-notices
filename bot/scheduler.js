const moment = require('moment-timezone');
moment.locale('en');

let notifyHandler;
let notifyTimeout;

function createEventNotifications ({ events, notifications, timezone }) {
    let currentTime = moment().tz(timezone);
    let eventNotificationList = [];
    for(let event of events) {
        event.time = moment().tz(timezone);
        event.time.day(event.weekday)
            .hour(event.hour)
            .minute(event.minute)
            .second(event.second);
        for(let notification of notifications) {
            let { minutesBefore, secondsBefore } = notification;
            let notifyTime = event.time.clone()
                .add(-minutesBefore, 'minutes')
                .add(-secondsBefore, 'seconds');
            if(notifyTime.isBefore(currentTime)) {
                notifyTime.add(1, 'week');
            }
            eventNotificationList.push({
                event,
                notification,
                notifyTime
            })
        }
        eventNotificationList.sort((a, b) => {
            return a.notifyTime - b.notifyTime
        });
    }
    return eventNotificationList;
}

function waitForNextEventNotification (eventNotifications) {
    let nextEventNotification = eventNotifications[0];
    let timeToWait = nextEventNotification.notifyTime - moment();
    notifyTimeout = setTimeout(() => {
        handleNextEventNotification(eventNotifications);
    }, timeToWait);
}

function handleNextEventNotification(eventNotifications) {
    let nextEventNotification = eventNotifications.shift();
    notifyHandler({
        event: nextEventNotification.event,
        notification: nextEventNotification.notification,
        notifyTime: nextEventNotification.notifyTime.clone()
    });
    nextEventNotification.notifyTime.add(1, 'week');
    eventNotifications.push(nextEventNotification);
    waitForNextEventNotification(eventNotifications);
}

module.exports = {
    init: options => {
        if(notifyTimeout) {
            clearTimeout(notifyTimeout);
        }
        notifyHandler = options.onNotify;
        let eventNotifications = createEventNotifications(options);
        waitForNextEventNotification(eventNotifications);
    }
};
