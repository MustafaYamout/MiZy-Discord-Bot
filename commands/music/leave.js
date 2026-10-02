const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leave the voice channel"),
    async execute(interaction, client) {
        const ctx = client.voiceContext(interaction, client, { requireQueue: false });
        if (!ctx) return;

        try {
            const queue = client.distube.getQueue(interaction);
            if (queue) await queue.stop();

            client.distube.voices.leave(interaction.guildId);

            await interaction.reply({
                content: `${client.lemoji.success} | Successfully left the voice channel!`,
            });
        } catch (err) {
            console.log(err);
            await interaction.reply({
                content: `${client.lemoji.error} | There was an error leaving the voice channel!`,
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
