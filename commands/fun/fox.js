const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName("fox")
    .setDescription("Posts a random fox image!"),

    async execute(interaction, client) {
        const res = await fetch("https://randomfox.ca/floof/");
        const { image: attachment } = await res.json();

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`[Fox pics!](https://randomfox.ca/)`)
        .setImage(attachment, "fox.png")
        .setFooter({ text: "Powered by randomfox.ca"})

        await interaction.reply({
            embeds: [embed]
        })
    }
}