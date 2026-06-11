const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Schema = require("../../database/models/economy");
const SchemaCooldown = require("../../database/models/economyCooldown");
const ms = require("ms");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily reward!"),
    async execute(interaction, client) {
        let timeout = 86400000;
        let min = 150
        let max = 201
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

        if (dataCooldown && dataCooldown.Daily !== null && timeout - (Date.now() - dataCooldown.Daily) > 0) {
            let time = ms(timeout - (Date.now() - dataCooldown.Daily), { long: true });

            const embedCooldown = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Error!")
            .setDescription(`:x: | You've already collected your daily reward! You can collect again in ${time}.`) 
            .setTimestamp();

            await interaction.reply({
                embeds: [embedCooldown],
                ephemeral: true
            })
        } else {
            if (data) {
                console.log("Data exists")

                if (dataCooldown) {
                    console.log("Data cooldown exists")
                    data.Money += amount;
                    dataCooldown.Daily = timeout - (Date.now() - dataCooldown.Daily)
                    data.save();
                    dataCooldown.save();

                    console.log("Data saved (All Data exists)")

                    const embedSuccess = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("Daily reward collected!")
                    .setDescription(`You have collected your daily reward of ${amount} coins!`)
                    .setFooter(`You can collect again in ${ms(timeout)}.`)

                    await interaction.reply({
                        embeds: [embedSuccess]
                    });
                } else {
                    data.Money += amount;
                    data.save();

                    

                    new SchemaCooldown({
                        User: interaction.user.id,
                        Daily: timeout - (Date.now() - dataCooldown.Daily)
                    }).save();

                    console.log("Data saved (Only Data exists)")

                    const embedSuccess = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("Daily reward collected!")
                    .setDescription(`You have collected your daily reward of ${amount} coins!`)
                    .setFooter(`You can collect again in ${ms(timeout)}.`)

                    await interaction.reply({
                        embeds: [embedSuccess]
                    });
                }
            } else {
                new Schema({
                    User: interaction.user.id,
                    Money: amount,
                    Bank: 0
                }).save();

                new SchemaCooldown({
                    User: interaction.user.id,
                    Daily: timeout - (Date.now() - dataCooldown.Daily)
                }).save();

                console.log("Data saved (No Data exists)")

                const embedSuccess = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("Daily reward collected!")
                    .setDescription(`You have collected your daily reward of ${amount} coins!`)
                    .setFooter(`You can collect again in ${ms(timeout)}.`)

                    await interaction.reply({
                        embeds: [embedSuccess]
                    });
            }
        }
    }
}