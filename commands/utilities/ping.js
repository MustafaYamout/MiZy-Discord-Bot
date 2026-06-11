const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with bot's latency."),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });
        const newmessage = `🏓Pong! Latency = \`${message.createdTimestamp - interaction.createdTimestamp}\`ms.\nAPI Latency = \`${Math.round(client.ws.ping)}ms\``

        await interaction.editReply({
            content: newmessage
        })
    }
}