const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "empty",
    async execute(queue) {
        const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`👋 | Voice channel is empty! Leaving the channel..`)
            .setTimestamp()

        await queue.textChannel.send({ embeds: [embed] }).catch(() => {});
    }
}
