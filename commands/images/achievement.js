const { SlashCommandBuilder } = require("@discordjs/builders");
var nb = Math.floor(Math.random() * 41);
var url = `https://minecraftskinstealer.com/achievement/${nb}/Achievement%20Get!/`;


module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("achievement")
    .setDescription("Make your own Minecraft achievement!")
    .addStringOption(option => option.setName("text")
    .setDescription("The text you want to put on the achievement.")
    .setRequired(true)),
    async execute(interaction, client) {
        let string = interaction.options.getString("text");
        var text = string.replaceAll(" ", "%20");
        text = string.replaceAll("?", "%3F");

        await interaction.reply({
            content: url + text,
        })
    }
}