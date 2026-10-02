const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("achievement")
    .setDescription("Make your own Minecraft achievement!")
    .addStringOption(option => option.setName("text")
    .setDescription("The text you want to put on the achievement.")
    .setMaxLength(50)
    .setRequired(true)),
    async execute(interaction, client) {
        const nb = Math.floor(Math.random() * 41);

        const text = encodeURIComponent(interaction.options.getString("text"));
        const url = `https://minecraftskinstealer.com/achievement/${nb}/Achievement%20Get!/${text}`;

        await interaction.reply({ content: url });
    }
}
