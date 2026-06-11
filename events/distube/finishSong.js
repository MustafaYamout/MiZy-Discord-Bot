const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "finishSong",
    async execute(queue, client) {
        const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`✅ | Finished playing \`${queue.songs[0].name}\``)
            .setTimestamp()

        await queue.textChannel.send({ embeds: [embed] });
    }
}