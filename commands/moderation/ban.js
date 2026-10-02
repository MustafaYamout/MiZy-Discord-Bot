const { SlashCommandBuilder, PermissionsBitField, MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the server.")
    .addUserOption(option => option.setName("user")
    .setDescription("Input the user you would like to ban.")
    .setRequired(true))
    .addStringOption(option => option.setName("reason")
    .setDescription("Input the reason you would like to ban this user.")
    .setRequired(false)),
    async execute(interaction, client) {

        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            flags: MessageFlags.Ephemeral,
        });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return await interaction.reply({
                content: "❌ | You don't have the `BanMembers` permission to ban a user!",
                flags: MessageFlags.Ephemeral,
            });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return await interaction.reply({
                content: "❌ | I don't have the `BanMembers` permission to ban a user! Please give me this permission and try again.",
                flags: MessageFlags.Ephemeral,
            });
        }

        const user = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason") || "No reason provided.";

        if (!user) return await interaction.reply({
            content: "❌ | That user is not a member of this server!",
            flags: MessageFlags.Ephemeral,
        });

        if (user.id === interaction.user.id) {
            return await interaction.reply({
                content: "❌ | You can't ban yourself!",
                flags: MessageFlags.Ephemeral,
            });
        }

        if (user.id === client.user.id) {
            return await interaction.reply({
                content: "❌ | You can't ban me!",
                flags: MessageFlags.Ephemeral,
            });
        }

        if (!user.bannable) {
            return await interaction.reply({
                content: "❌ | I can't ban this user! Please make sure that I have a higher role than the member you are trying to ban.",
                flags: MessageFlags.Ephemeral,
            });
        }

        await user.ban({ reason });

        await interaction.reply({
            content: `✅ | Successfully banned ${user.user.username}!`
        });
    }
}
