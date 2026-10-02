const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
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
        const owner = process.env.ownerid;

        if (interaction.user.id !== owner) return await interaction.reply({
            content: "❌ | You can't use this command!",
            flags: MessageFlags.Ephemeral,
        });

        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            flags: MessageFlags.Ephemeral,
        });

        if (user.bot) return await interaction.reply({
            content: "❌ | You can't add balance to a bot!",
            flags: MessageFlags.Ephemeral,
        });

        if (amount <= 0) return await interaction.reply({
            content: "❌ | Amount must be greater than 0!",
            flags: MessageFlags.Ephemeral,
        })

        let data = await Schema.findOne({ User: user.id });

        const previous = data ? data.Money : 0;

        if (data) {
            data.Money += amount;
            await data.save();
        } else {
            data = await new Schema({
                User: user.id,
                Money: amount,
                Bank: 0
            }).save();
        }

        const embed = new EmbedBuilder()
        .setTitle(`Successfully added ${amount} into ${user.username}\'s wallet!`)
        .setColor("Green")
        .addFields(
            { name: "Initial amount", value: `${previous} coins`, inline: true },
            { name: "Result amount", value: `${data.Money} coins`, inline: true },
        )
        .setTimestamp()

        await interaction.reply({ embeds: [embed] });
    }
}
