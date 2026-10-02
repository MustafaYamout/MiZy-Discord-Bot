const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("previous")
    .setDescription("Play the previous song!"),
    async execute(interaction, client) {
        if (!client.voiceContext(interaction, client)) return;

        try {
            await client.distube.previous(interaction);

            await interaction.reply({
                content: `${client.lemoji.play} | Started playing the previous song!`
            });
        } catch (err) {
            console.log(err)
            await interaction.reply({
                content: `${client.lemoji.error} | There is no previous song in this queue...`,
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
