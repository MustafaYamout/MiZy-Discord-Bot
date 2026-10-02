const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const progressbar = require("string-progressbar");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Set volume of the song!")
    .addIntegerOption(option => option
    .setName("volume")
    .setMinValue(0)
    .setMaxValue(100)
    .setDescription("The volume you want to set!")
    .setRequired(true)),
    async execute(interaction, client) {
        const ctx = client.voiceContext(interaction, client);
        if (!ctx) return;

        const { queue } = ctx;
        const volume = interaction.options.getInteger("volume");

        client.distube.setVolume(interaction, volume);

        const bar = progressbar.splitBar(100, volume, 20, "▬", "🔘")[0];

        const embed = new EmbedBuilder()
        .setTitle("✅ | New Volume set!")
        .setColor("Green")
        .setDescription(`\`${bar}\` \n Set the volume to \`${volume}\``)
        .setTimestamp()

        await interaction.reply({ embeds: [embed] });
    }
}
