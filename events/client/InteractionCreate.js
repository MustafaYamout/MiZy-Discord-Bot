const { Collection, Permissions } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            const { cooldowns } = client;

            if (!command) return;

            if(!cooldowns.has(command.data.name)) {
               cooldowns.set(command.data.name, new Collection()); 
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);
            const defaultCooldown = 3;
            const cooldownAmount = (command.data.cooldown || defaultCooldown) * 1000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;

                    return interaction.reply({
                        content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.data.name}\` command!`,
                        ephemeral: true
                    });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

            try {
                await command.execute(interaction, client);
            } catch (err) {
                console.log("An error occured: ", err);

                await interaction.reply({
                    content: `An error occured while executing the command: ${err}`,
                    ephemeral: true
                });
            }

        }
    }
}