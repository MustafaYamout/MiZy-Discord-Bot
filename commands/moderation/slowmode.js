const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Insert a ratelimit for a channel.")
    .addIntegerOption(option => option
    .setName("seconds")
    .setDescription("The rate limit in seconds.")
    .setRequired(true)),
    async execute(interaction, client) {

        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            ephemeral: true
        });

        if (!interaction.members.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ 
            content: "❌ | You don't have the `ManageChannels` permission to change the slowmode!",
            ephemeral: true
        });

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ 
            content: "❌ | I don't have the `ManageChannels` permission to change the slowmode! Please give me this permission and try again.",
            ephemeral: true
        });
        
        const seconds = interaction.options.getInteger("seconds");

        if (seconds > 21600 || seconds < 0) return await interaction.reply({ content: "❌ | The number must be less than 21600!" });

        interaction.channel.setRateLimitPerUser(seconds)

        if (seconds != 0) {
            await interaction.reply({
                content: `✅ | Set the channel slowmode to ${seconds}!`
            })
        } else {
            await interaction.reply({
                content: `✅ | Cleared the channel's slowmode!`
            })
        }
    }
}