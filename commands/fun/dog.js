const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName("dog")
    .setDescription("Posts a random dog image!"),

    async execute(interaction, client) {
        const res = await fetch("https://dog.ceo/api/breeds/image/random");
        const { message: attachment } = await res.json();

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`[Dog pics!](https://dog.ceo/)`)
        .setImage(attachment, "dog.png")
        .setFooter({ text: "Powered by dog.CEO"})

        await interaction.reply({
            embeds: [embed]
        })
    }
}