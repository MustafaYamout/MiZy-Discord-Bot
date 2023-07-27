const { SlashCommandBuilder, EmbedBuilder, AutoModerationActionExecution } = require("discord.js");
const Schema = require("../../database/models/economy");
require("dotenv").config();

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("addbalance")
    .setDescription("Add balance to a user! (Owner/Developer only)")
    .addUserOption(option => option
    .setName("user")
    .setDescription("The user you want to check the balance of.")
    .setRequired(true))
    .addIntegerOption(option => option
    .setName("amount")
    .setDescription("The amount of coins you want to add.")
    .setRequired(true)),
    async execute(interaction, client) {
        const user = interaction.options.getUser("user");
        const amount = interaction.options.getInteger("amount");
        let owner = process.env.ownerID || "267299812339220480";

        if (interaction.user.id !== owner) return interaction.reply({
            content: "❌ | You can't use this command!",
            ephemeral: true
        });

        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            ephemeral: true
        });

        if (user.bot) return interaction.reply({
            content: "❌ | You can't add balance to a bot!",
            ephemeral: true
        });

        if (amount <= 0) return await interaction.reply({
            content: "❌ | Amount must be greater than 0!",
            ephemeral: true
        })

        const data = await Schema.findOne({
            User: user.id
        });

        if (data) {
            data.Money += amount;
            data.save();

            const embed = new EmbedBuilder()
            .setTitle(`Successfully added ${amount} into ${user.username}\'s wallet!`)
            .setColor("Green")
            .addFields(
                { name: "Initial amount", value: `${data.Money - amount} coins`, inline: true },
                { name: "Result amount", value: `${data.Money} coins`, inline: true },
            )
            .setTimestamp()

            interaction.reply({
                embeds: [embed] 
            });
        } else {

            new Schema({
                User: user.id,
                Money: amount,
                Bank: 0
            }).save();

            const embed = new EmbedBuilder()
            .setTitle(`Successfully added ${amount} into ${user.username}\'s wallet!`)
            .setColor("Green")
            .addFields(
                { name: "Initial amount", value: `${data.Money - amount} coins`, inline: true },
                { name: "Result amount", value: `${data.Money} coins`, inline: true },
            )
            .setTimestamp()

            interaction.reply({
                embeds: [embed] 
            });
        }
    }
}