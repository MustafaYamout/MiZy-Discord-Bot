const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffle the queued songs!"),
    async execute(interaction, client) {
        if (!client.voiceContext(interaction, client)) return;

        try {
            await client.distube.shuffle(interaction);

            await interaction.reply({
                content: `${client.lemoji.shuffle} | Shuffled the queue!`
            });
        } catch (err) {
            console.log(err)
            await interaction.reply({
                content: `${client.lemoji.error} | There was an error shuffling the queue!`,
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
