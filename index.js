
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();

// Charger les handlers
['commands', 'events'].forEach(folder => {
    const files = fs.readdirSync(`./${folder}`).filter(file => file.endsWith('.js'));
    for (const file of files) {
        const command = require(`./${folder}/${file}`);
        if (folder === 'commands') client.commands.set(command.data.name, command);
        if (folder === 'events') {
            const event = require(`./${folder}/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }
});

client.login('YOUR_BOT_TOKEN');
