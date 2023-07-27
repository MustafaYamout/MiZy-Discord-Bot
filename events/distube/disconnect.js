const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "disconnect",
    async execute(queue) {
        const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`👋 | I have disconnected from the voice channel.`)
            .setTimestamp()

        await queue.textChannel.send({ embeds: [embed] });
    }
}