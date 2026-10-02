const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("jump")
    .setDescription("Jump to another song!")
    .addIntegerOption(option => option
    .setName("number")
    .setDescription("Jump to a specific song ID in the queue.")
    .setMinValue(1)
    .setRequired(true)),
    async execute(interaction, client) {
        const ctx = client.voiceContext(interaction, client);
        if (!ctx) return;

        const id = interaction.options.getInteger("number");

        try {
            await client.distube.jump(interaction, id);

            await interaction.reply({
                content: `${client.lemoji.success} | Jumped to song number ${id}!`,
            });
        } catch (err) {
            console.log(err)
            await interaction.reply({
                content: `${client.lemoji.error} | Invalid song ID!`,
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
