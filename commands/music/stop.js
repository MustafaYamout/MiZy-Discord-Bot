const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the song and clears the queue"),
    async execute(interaction, client) {
        if (!client.voiceContext(interaction, client)) return;

        try {
            await client.distube.stop(interaction);

            await interaction.reply({
                content: `${client.lemoji.stop} | Stopped the song!`
            });
        } catch (err) {
            console.log(err)
            await interaction.reply({
                content: `${client.lemoji.error} | There was an error stopping the song!`,
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
