require("dotenv").config();
require("./database/connect")();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const emojis = {
    "play": "▶️",
    "stop": "⏹️",
    "queue": "📄",
    "success": "✅",
    "repeat": "🔁",    
    "error": "❌",
    "pause": "⏸️",
    "shuffle": "🔀",
    "skip": "⏭️",
}

const client = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
]});

client.commands = new Collection();
client.cooldowns = new Collection();
client.commandArray = [];
client.lemoji = emojis;

const functionfolder = fs.readdirSync("./functions/");

for (const folders of functionfolder) {
    const functionfiles = fs.readdirSync(`./functions/${folders}`)
    .filter((files) => files.endsWith(".js"));

    switch (folders) {
        case "handlers":
            for (const file of functionfiles)
                require(`./functions/${folders}/${file}`)(client);
            break;
        
        case "Util":
            for (const file of functionfiles)
                require(`./functions/${folders}/${file}`)(client);
            break;
            
    }
}

client.HandleEvents();
client.HandleCommands();

client.login(process.env.token)