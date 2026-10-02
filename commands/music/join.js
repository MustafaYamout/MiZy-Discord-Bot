const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Move to your voice channel"),
    async execute(interaction, client) {
        const ctx = client.voiceContext(interaction, client, { requireQueue: false });
        if (!ctx) return;

        const { queue, voiceChannel } = ctx;

        if (queue && queue.voice.channel.id === voiceChannel.id) {
            return await interaction.reply({
                content: `${client.lemoji.error} | I'm already in your voice channel!`,
                flags: MessageFlags.Ephemeral,
            });
        }

        try {
            await client.distube.voices.join(voiceChannel);

            await interaction.reply({
                content: `${client.lemoji.success} | Successfully joined the voice channel!`,
            });
        } catch (err) {
            console.log(err);
            await interaction.reply({
                content: `${client.lemoji.error} | There was an error joining the voice channel! ${err}`,
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
