const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "addSong",
    async execute(queue, song, client) {
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`${client.lemoji.success} | Song has been added to queue!`)
            .setThumbnail(song.thumbnail)
            .setDescription(`\`${song.name}\` - \`${song.formattedDuration}\` - Requested by ${song.user}`)
            .setTimestamp()

        await queue.textChannel.send({ embeds: [embed] });
    }
}