const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("autoplay")
    .setDescription("Enable/Disable autoplay for the queue!"),
    async execute(interaction, client) {
        if (!client.voiceContext(interaction, client)) return;

        try {
            const mode = client.distube.toggleAutoplay(interaction);

            await interaction.reply({
                content: `✅ | Set autoplay mode to \`${mode ? "True" : "False"}\``
            });
        } catch (err) {
            console.log(err)
            await interaction.reply({
                content: `${client.lemoji.error} | There was an error toggling autoplay!`,
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
