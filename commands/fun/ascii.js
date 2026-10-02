const { SlashCommandBuilder } = require("discord.js");
const figlet = require("figlet");
const { promisify } = require("util");

const render = promisify(figlet);

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("ascii")
    .setDescription("Turn your text into ASCII art!")
    .addStringOption(option => option.setName("text")
    .setDescription("The text you want to put on the achievement.")
    .setMaxLength(100)
    .setRequired(true)),
    async execute(interaction, client) {
        const text = interaction.options.getString("text");

        try {
            const data = await render(text);

            await interaction.reply({ content: "```" + data.slice(0, 1900) + "```" });
        } catch (err) {
            console.dir(err);
            await interaction.reply({ content: "Something went wrong... Please try again later." });
        }
    }
}
