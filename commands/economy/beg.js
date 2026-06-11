const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Schema = require("../../database/models/economy");
const SchemaCooldown = require("../../database/models/economyCooldown");

// BROKEN //

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("beg")
    .setDescription("Beg for money!"),

    async execute(interaction, client) {
        let min = 5
        let max = 51
        let timeout = 3000;
        let amount = Math.floor(Math.random() * (max - min)) + min;

        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            ephemeral: true
        });

        const data = await Schema.findOne({
            User: interaction.user.id
        });

        const dataCooldown = await SchemaCooldown.findOne({
            User: interaction.user.id
        });

        if (dataCooldown && dataCooldown.Beg !== null && timeout - (Date.now() - dataCooldown.Beg) > 0) {
            let time = (dataCooldown.Beg / 1000 + timeout / 1000).toFixed(0);

            const embedCooldown = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Error!")
            .setDescription(`:x: | You've already begged! Beg again in ${time.minutes}m ${time.seconds}s`)
            .setTimestamp();

            await interaction.reply({
                embeds: [embedCooldown],
                ephemeral: true
            });
        } else if (dataCooldown) {
            let time = (dataCooldown.Beg / 1000 + timeout / 1000).toFixed(0);

            const embedBegged = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`You have begged and received ${amount} coins!`)
            .setFooter(`You can beg again after ${time.minutes}m ${time.seconds}s.`)

            await interaction.reply({
                embeds: [embedBegged]
            });

            if (dataCooldown) {
                dataCooldown.Beg = Date.now();
                dataCooldown.save();
            } else {
                new SchemaCooldown({
                    User: interaction.user.id,
                    Beg: Date.now()
                }).save();
            }

            if (data) {
                data.Money += amount
                data.save();
            } else {
                new Schema({
                    User: interaction.user.id,
                    Money: amount,
                    Bank: 0
                }).save();
            }
        } else {
            new SchemaCooldown({
                User: interaction.user.id,
                Beg: Date.now()
            }).save();
        }
    }
}