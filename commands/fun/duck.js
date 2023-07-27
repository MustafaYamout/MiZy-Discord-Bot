const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName("duck")
    .setDescription("Posts a random duck image!"),

    async execute(interaction, client) {
        const res = await fetch("https://random-d.uk/api/random");
        const { url: attachment } = await res.json();

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`[Duck pics!](https://random-d.uk/)`)
        .setImage(attachment, "duck.jpg")
        .setFooter({ text: "Powered by random-d.uk"})

        await interaction.reply({
            embeds: [embed]
        })
    }
}