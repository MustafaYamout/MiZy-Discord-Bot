const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
const ascii = require("ascii-table");
const table = new ascii().setHeading("Command", "Load Status");
require("dotenv").config();

module.exports = (client) => {
    client.HandleCommands = async() => {
        const commandFolders = fs.readdirSync(path.join(__dirname, "../../commands"));

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(path.join(__dirname, "../../commands", folder))
            .filter((files) => files.endsWith(".js"));

            const { commands } = client;

            for (const file of commandFiles) {
                const command = require(path.join(__dirname, "../../commands", folder, file));
                const properties = {folder, ...command};

                commands.set(command.data.name, properties);

                table.addRow(file, "✅");
            }
        }

        const commandArray = client.commands.map((command) => command.data.toJSON());

        const rest = new REST({ version: "10" }).setToken(process.env.token);

        try {
            console.log(table.toString(), "\n Loaded Commands");
            console.log("Started refreshing application (/) commands.");

            await rest.put(Routes.applicationCommands(process.env.clientid), {
                body: commandArray,
            });

            console.log("Successfully reloaded application (/) commands.");
        } catch (error) {
            console.error("[ERROR] >> Failed to register application commands:");
            console.error(error);
            throw error;
        }
    }
}
