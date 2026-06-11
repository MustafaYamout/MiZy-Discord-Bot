const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("prune")
    .setDescription("Prune a certain amount of messages.")
    .addIntegerOption(option => option
    .setName("amount")
    .setDescription("The amount of messages you want to prune.")
    .setRequired(true)),
    async execute(interaction, client) {

        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            ephemeral: true
        });

        if (!interaction.members.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply({ 
            content: "❌ | You don't have the `ManageMessages` permission to change the slowmode!",
            ephemeral: true
        });

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply({ 
            content: "❌ | I don't have the `ManageMessages` permission to change the slowmode! Please give me this permission and try again.",
            ephemeral: true
        });
        
        const amount = interaction.options.getInteger("amount");

        if (amount < 1 || amount > 100) return await interaction.reply({ content: "You can only prune between 1 and 100 messages." });

        await interaction.channel.messages.fetch({ limit: amount }).then(messages => {
            interaction.channel.bulkDelete(messages);
        });

        await interaction.reply({
            content: `✅ | Successfully pruned ${amount} messages!`,
            ephemeral: true
        })
    }
}