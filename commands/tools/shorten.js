const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
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

        let link;
        try {
            link = await isgd.shorten(url);
        } catch (err) {
            console.log(err);
        }

        if (!link || typeof link !== "string") {
            return await interaction.reply({
                content: `❌ | I couldn't shorten \`${url}\`. Please make sure it's a valid http(s) URL.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Your shortened URL has been created!")
        .addFields({ name: "Link:", value: `${link}`, inline: true })
        .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
}
