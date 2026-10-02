const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume the paused song!"),
    async execute(interaction, client) {
        if (!client.voiceContext(interaction, client)) return;

        try {
            await client.distube.resume(interaction);

            await interaction.reply({
                content: `${client.lemoji.resume} | Resumed the song!`
            });
        } catch (err) {
            console.log(err)
            await interaction.reply({
                content: `${client.lemoji.error} | The queue isn't paused.`,
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
