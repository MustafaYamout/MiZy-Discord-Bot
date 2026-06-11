const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the server.")
    .addUserOption(option => option.setName("user")
    .setDescription("Input the user you would like to kick.")
    .setRequired(true))
    .addStringOption(option => option.setName("reason")
    .setDescription("Input the reason you would like to kick this user.")
    .setRequired(false)),
    async execute(interaction, client) {

        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            ephemeral: true
        });
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return await interaction.reply({
                content: "❌ | You don't have the `KickMembers` permission to kick a user!"
            });
        } else {
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
                return await interaction.reply({
                    content: "❌ | I don't have the `KickMembers` permission to kick a user! Please give me this permission and try again."
                });
            } else {
                const user = interaction.options.getMember("user");
                const reason = interaction.options.getString("reason") || "No reason provided.";

                if (user.id === interaction.user.id) {
                    return await interaction.reply({
                        content: "❌ | You can't kick yourself!",
                        ephemeral: true
                    });
                } else if (user.id === client.user.id) {
                    return await interaction.reply({
                        content: "❌ | You can't kick me!",
                        ephemeral: true
                    });
                } else if (user.id === interaction.guild.ownerId) {
                    return await interaction.reply({
                        content: "❌ | You can't kick the server owner!",
                        ephemeral: true
                    });
                } else {
                    if (!user.kickable) {
                        return await interaction.reply({
                            content: "❌ | I can't kick this user! Please make sure that I have a higher role than the member you are trying to kick.",
                            ephemeral: true
                        });
                    } else {
                        await user.ban({ reason: reason });

                        await interaction.reply({
                            content: `✅ | Successfully kickeded ${user.user.tag}!`
                        });
                    }
                }
            }
        }
    }
}
