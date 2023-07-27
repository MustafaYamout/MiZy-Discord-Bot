const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const fs = require("fs");
const ascii = require("ascii-table");
const table = new ascii().setHeading("Command", "Load Status");
require("dotenv").config();

module.exports = (client) => {
    client.HandleCommands = async() => {
        const commandFolders = fs.readdirSync("./commands");
        
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./commands/${folder}/`)
            .filter((files) => files.endsWith(".js"));

            const { commands, commandArray } = client;

            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                const properties = {folder, ...command}

                commands.set(command.data.name, properties);
                commandArray.push(command.data.toJSON());

                table.addRow(file, "✅");
            }
        }

        const rest = new REST({ version: '10' }).setToken(process.env.token);

        try {
            console.log(table.toString(), "\n Loaded Commands")
            console.log("Started refreshing application (/) commands.");

	        await rest.put(Routes.applicationCommands(process.env.clientid), {
		        body: client.commandArray
	        });

            console.log("Successfully reloaded application (/) commands.");
        } catch (error) {
            console.error(error);
        }
    }
}