const { SlashCommandBuilder, PermissionsBitField, MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Delete a giveaway!")
    .addStringOption(option => option
    .setName("messageid")
    .setDescription("Input the message ID of the giveaway you would like to delete.")
    .setRequired(true)),
    async execute(interaction, client) {
        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            flags: MessageFlags.Ephemeral,
        });

        const allowed = interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)
            || interaction.member.roles.cache.some(role => role.name === "Giveaways");

        if (!allowed) return await interaction.reply({
            content: "❌ | You need the `ManageGuild` permission or the `Giveaways` role to do that!",
            flags: MessageFlags.Ephemeral,
        });

        const MessageID = interaction.options.getString("messageid");
        const giveaway = client.giveaways.giveaways.find((g) => g.messageId === MessageID && g.guildId === interaction.guildId);

        if (!giveaway) return await interaction.reply({
            content: "❌ | I couldn't find a giveaway for `" + MessageID + "`. Maybe this message ID is not from this guild?",
            flags: MessageFlags.Ephemeral,
        });

        try {
            await client.giveaways.delete(MessageID);

            await interaction.reply({
                content: "✅ | Successfully deleted the giveaway!",
                flags: MessageFlags.Ephemeral,
            });
        } catch (err) {
            console.log(err);
            await interaction.reply({
                content: "❌ | I couldn't delete that giveaway. It may have already been deleted.",
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
