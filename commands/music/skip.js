const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the playing song!"),
    async execute(interaction, client) {
        if (!client.voiceContext(interaction, client)) return;

        try {
            await client.distube.skip(interaction)

            await interaction.reply({
                content: `${client.lemoji.skip} | Skipped the song!`
            });
        } catch (err) {
            console.log(err)
            await interaction.reply({
                content: `${client.lemoji.error} | There is no song to skip!`,
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
