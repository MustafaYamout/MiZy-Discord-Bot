const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Schema = require("../../database/models/economy");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your or someone\'s balance!")
    .addUserOption(option => option
    .setName("user")
    .setDescription("The user you want to check the balance of.")
    .setRequired(false)),
    async execute(interaction, client) {
        const user = interaction.options.getUser("user") || interaction.user;

        if (user.bot) return interaction.reply({
            content: "❌ | You can't check the balance of a bot!",
            ephemeral: true
        });

        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            ephemeral: true
        });

        const data = await Schema.findOne({
            User: user.id
        })

        if (data) {
            const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Balance`)
            .setColor("Random")
            .addFields(
                { name: "Total", value: `${data.Money + data.Bank} coins`, inline: true },
                { name: "Wallet", value: `${data.Money} coins`, inline: true },
                { name: "Bank", value: `${data.Bank} coins`, inline: true }
            )
            .setTimestamp()

            interaction.reply({
                embeds: [embed] 
            });
        } else {

            new Schema({
                User: user.id,
                Money: 0,
                Bank: 0
            }).save();

            const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Balance`)
            .setColor("Random")
            .addFields(
                { name: "Total", value: `${data.Money + data.Bank} coins`, inline: true },
                { name: "Wallet", value: `${data.Money} coins`, inline: true },
                { name: "Bank", value: `${data.Bank} coins`, inline: true }
            )
            .setTimestamp()

            interaction.reply({
                embeds: [embed] 
            });
        }
    }
}