const { SlashCommandBuilder, PermissionsBitField, MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Add a certain role to a user.")
    .addUserOption(option => option
    .setName("user")
    .setDescription("The user you want to add the role to.")
    .setRequired(true))
    .addRoleOption(option => option
    .setName("role")
    .setDescription("The role you want to add to the user.")
    .setRequired(true)),
    async execute(interaction, client) {

        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            flags: MessageFlags.Ephemeral,
        });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return await interaction.reply({
            content: "❌ | You don't have the `ManageRoles` permission to add a role to a user!",
            flags: MessageFlags.Ephemeral,
        });

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) return await interaction.reply({
            content: "❌ | I don't have the `ManageRoles` permission to add a role to a user! Please give me this permission and try again.",
            flags: MessageFlags.Ephemeral,
        })

        const user = interaction.options.getMember("user");
        const role = interaction.options.getRole("role");

        if (!user) return await interaction.reply({
            content: "❌ | That user is not a member of this server!",
            flags: MessageFlags.Ephemeral,
        });

        if (user.roles.cache.has(role.id)) return await interaction.reply({
            content: "❌ | This user already has this role!",
            flags: MessageFlags.Ephemeral,
        });

        if (!user.manageable) return await interaction.reply({
            content: "❌ | I can't add this role to this user! Please make sure that I have a higher role than the member you are trying to add a role to.",
            flags: MessageFlags.Ephemeral,
        });

        await user.roles.add(role);

        await interaction.reply({
            content: `✅ | Successfully added the role \`${role.name}\` to ${user.user.username}!`
        });
    }
}
