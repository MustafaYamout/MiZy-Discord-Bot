const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Seek to a specific time in the current song!")
    .addIntegerOption(option => option
    .setName("seconds")
    .setDescription("The position to seek to, in seconds.")
    .setMinValue(0)
    .setRequired(true)),
    async execute(interaction, client) {
        const ctx = client.voiceContext(interaction, client);
        if (!ctx) return;

        const { queue } = ctx;
        const seconds = interaction.options.getInteger("seconds");
        const song = queue.songs[0];

        if (!song) {
            return await interaction.reply({
                content: `${client.lemoji.error} | There is nothing playing!`,
                flags: MessageFlags.Ephemeral,
            });
        }

        if (song.duration && seconds > song.duration) {
            return await interaction.reply({
                content: `${client.lemoji.error} | That position is past the end of the song (${song.formattedDuration}).`,
                flags: MessageFlags.Ephemeral,
            });
        }

        try {
            await client.distube.seek(interaction, seconds);

            await interaction.reply({
                content: `${client.lemoji.success} | Seeked to \`${seconds}s\`!`
            });
        } catch (err) {
            console.log(err)
            await interaction.reply({
                content: `${client.lemoji.error} | I couldn't seek to that position.`,
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
