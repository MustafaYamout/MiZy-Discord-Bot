const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const Schema = require("../../database/models/economy");
const SchemaCooldown = require("../../database/models/economyCooldown");
const ms = require("ms");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily reward!"),
    async execute(interaction, client) {
        const timeout = 86400000; // 24h
        const min = 150;
        const max = 201;
        const amount = Math.floor(Math.random() * (max - min)) + min;

        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            flags: MessageFlags.Ephemeral,
        });

        let dataCooldown = await SchemaCooldown.findOne({ User: interaction.user.id });
        const now = Date.now();

        if (dataCooldown && dataCooldown.Daily && now - dataCooldown.Daily < timeout) {
            const remaining = timeout - (now - dataCooldown.Daily);

            const embedCooldown = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Error!")
            .setDescription(`:x: | You've already collected your daily reward! You can collect again in ${ms(remaining, { long: true })}.`)
            .setTimestamp();

            return await interaction.reply({
                embeds: [embedCooldown],
                flags: MessageFlags.Ephemeral,
            })
        }

        let data = await Schema.findOne({ User: interaction.user.id });

        if (data) {
            data.Money += amount;
            await data.save();
        } else {
            data = await new Schema({
                User: interaction.user.id,
                Money: amount,
                Bank: 0
            }).save();
        }

        if (dataCooldown) {
            dataCooldown.Daily = now;
            await dataCooldown.save();
        } else {
            dataCooldown = await new SchemaCooldown({
                User: interaction.user.id,
                Daily: now
            }).save();
        }

        const embedSuccess = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Daily reward collected!")
        .setDescription(`You have collected your daily reward of ${amount} coins!`)
        .setFooter({ text: `You can collect again in ${ms(timeout, { long: true })}.` })

        await interaction.reply({ embeds: [embedSuccess] });
    }
}
