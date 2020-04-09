
const Eris = require('eris');
const bot = new Eris(process.env.TOKEN, { disableEveryone: false });

bot.on('ready', () => {
    console.log(`${bot.user.username}#${bot.user.discriminator} is online in ${bot.guilds.size} server(s)`);
});

bot.on('error', console.log);

module.exports = {
    start: () => bot.connect(),
    onReady: callback => {
        bot.on('ready', callback);
    },
    onMessage: callback => {
        bot.on('messageCreate', callback)
    },
    createMessage: async (channelID, content, file) => {
        try {
            await bot.createMessage(channelID, content, file);
        } catch(e) {
            console.log('Error sending message:', e.message);
        }
    },
    getRoleMention: (channelID, roleName) => {
        roleName = roleName.toLowerCase();
        if(roleName === 'everyone' || roleName === 'here') {
            return `@${roleName}`;
        }
        let guild = bot.guilds.get(bot.channelGuildMap[channelID]);
        if(!guild) throw new Error('Invalid channel ID ' + channelID);
        let role = guild.roles.find(r => r.name.toLowerCase() === roleName);
        if(role.mentionable) {
            return role.mention;
        } else {
            return `@${roleName}`;
        }
    }
};
