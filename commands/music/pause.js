const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the current song."),
    async execute(interaction, client) {
        if (!client.voiceContext(interaction, client)) return;

        try {
            await client.distube.pause(interaction);

            await interaction.reply({
                content: `⏸ | Paused the current song!`
            });
        } catch (err) {
            console.log(err)
            await interaction.reply({
                content: `${client.lemoji.error} | The queue is already paused.`,
                flags: MessageFlags.Ephemeral,
            })
        }
    }
}
