const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const topic = require("../../assets/topics.json");


module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("topic")
    .setDescription("Replies with topic for you and your friends to answer!"),
    async execute(interaction, client) {
        const index = topic[Math.floor(Math.random() * topic.length)]

        await interaction.reply({
            content: `${index.topic}`
        });
    }
}