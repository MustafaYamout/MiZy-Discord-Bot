const { SlashCommandBuilder, PermissionsBitField, MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("prune")
    .setDescription("Prune a certain amount of messages.")
    .addIntegerOption(option => option
    .setName("amount")
    .setDescription("The amount of messages you want to prune.")
    .setMinValue(1)
    .setMaxValue(100)
    .setRequired(true)),
    async execute(interaction, client) {

        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            flags: MessageFlags.Ephemeral,
        });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply({
            content: "❌ | You don't have the `ManageMessages` permission to prune messages!",
            flags: MessageFlags.Ephemeral,
        });

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply({
            content: "❌ | I don't have the `ManageMessages` permission to prune messages! Please give me this permission and try again.",
            flags: MessageFlags.Ephemeral,
        });

        if (!interaction.channel.isTextBased()) return await interaction.reply({
            content: "❌ | This command can only be used in a text channel!",
            flags: MessageFlags.Ephemeral,
        });

        const amount = interaction.options.getInteger("amount");

        if (amount < 1 || amount > 100) return await interaction.reply({
            content: "❌ | You can only prune between 1 and 100 messages.",
            flags: MessageFlags.Ephemeral,
        });

        const messages = await interaction.channel.messages.fetch({ limit: amount });
        const deleted = await interaction.channel.bulkDelete(messages);

        await interaction.reply({
            content: `✅ | Successfully pruned ${deleted.size} message(s)!` +
                (deleted.size < amount ? `\n⚠️ | ${amount - deleted.size} message(s) were older than 14 days and could not be deleted.` : ""),
            flags: MessageFlags.Ephemeral,
        })
    }
}
