const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("end")
    .setDescription("End a giveaway!")
    .addStringOption(option => option
    .setName("messageid")
    .setDescription("Input the message ID of the giveaway you would like to end.")
    .setRequired(true)),
    async execute(interaction, client) {
        const MessageID = interaction.options.getString("messagid")
        const giveaway = client.giveaways.giveaways.find((g) => g.messageId === MessageID && g.guildId === interaction.guildId);


        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            ephemeral: true
        });

        if (!interaction.member.roles.cache.some(role => role.name === "Giveaways")) return await interaction.reply({
            content: "❌ | You don't have the `Giveaways` role to start a giveaway!",
            ephemeral: true
        });

        if(!giveaway) return await interaction.reply({
            content: "❌ | I couldn't find a giveaway for \`" + MessageID + "\`. Maybe this message ID is not from this guild?",
            ephemeral: true
        });

        client.giveaways.end(MessageID).then(() => {
            interaction.reply({
                content: "✅ | Successfully ended the giveaway!",
                ephemeral: true
            });
        }).catch((err) => {
            console.log(err);
            interaction.reply({
                content: "❌ | I couldn't find a giveaway for \`" + MessageID + "\`. Maybe this message ID is not from this guild?",
                ephemeral: true
            });
        });
    }
}