require("dotenv").config();
require("./database/connect")();

const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

const emojis = {
    "play": "▶️",
    "stop": "⏹️",
    "queue": "📄",
    "success": "✅",
    "repeat": "🔁",
    "error": "❌",
    "pause": "⏸️",
    "resume": "▶️",
    "shuffle": "🔀",
    "skip": "⏭️",
}

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
]});

client.commands = new Collection();
client.cooldowns = new Collection();
client.commandArray = [];
client.lemoji = emojis;

const functionfolder = fs.readdirSync(path.join(__dirname, "functions"));

for (const folder of functionfolder) {
    const functionfiles = fs.readdirSync(path.join(__dirname, "functions", folder))
    .filter((files) => files.endsWith(".js"));

    switch (folder) {
        case "handlers":
            for (const file of functionfiles)
                require(path.join(__dirname, "functions", folder, file))(client);
            break;

        case "Util":
            for (const file of functionfiles)
                require(path.join(__dirname, "functions", folder, file))(client);
            break;
    }
}

async function main() {
    await client.HandleEvents();
    await client.HandleCommands();

    await client.login(process.env.token);
}

main();
