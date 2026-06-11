const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const isgd = require("isgd-api");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName("shorten")
    .setDescription("Shorten a URL!")
    .addStringOption(option => option
    .setName("url")
    .setDescription("The URL you would like to shorten.")
    .setRequired(true)),
    async execute(interaction, client) {
        const url = interaction.options.getString("url");
        
        const link = await isgd.shorten(url);

        const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Your shortened URL has been created!")
        .addFields({ name: "Link:", value: `${link}`, inline: true })
        .setTimestamp();
        
        await interaction.reply({
            embeds: [embed]
        })
    }
}