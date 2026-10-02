const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const Schema = require("../../database/models/economy");
const SchemaCooldown = require("../../database/models/economyCooldown");
const ms = require("ms");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("beg")
    .setDescription("Beg for money!"),

    async execute(interaction, client) {
        const min = 5;
        const max = 51;
        const timeout = 3000; // 3 seconds
        const amount = Math.floor(Math.random() * (max - min)) + min;

        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            flags: MessageFlags.Ephemeral,
        });

        let dataCooldown = await SchemaCooldown.findOne({ User: interaction.user.id });
        const now = Date.now();

        if (dataCooldown && dataCooldown.Beg && now - dataCooldown.Beg < timeout) {
            const remaining = timeout - (now - dataCooldown.Beg);

            const embedCooldown = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Error!")
            .setDescription(`:x: | You've already begged! Beg again in ${ms(remaining, { long: true })}.`)
            .setTimestamp();

            return await interaction.reply({
                embeds: [embedCooldown],
                flags: MessageFlags.Ephemeral,
            });
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
            dataCooldown.Beg = now;
            await dataCooldown.save();
        } else {
            dataCooldown = await new SchemaCooldown({
                User: interaction.user.id,
                Beg: now
            }).save();
        }

        const embedBegged = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`You have begged and received ${amount} coins!`)
        .setFooter({ text: `You can beg again after ${ms(timeout, { long: true })}.` })

        await interaction.reply({ embeds: [embedBegged] });
    }
}
