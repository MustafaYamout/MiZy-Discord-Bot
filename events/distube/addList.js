const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "addList",
    async execute(queue, playlist, client) {

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`List has been added to queue!}`)
            .setDescription(`✅ | Added \`${playlist.name}\` playlist  - ${playlist.songs.length} songs has been to queue!`)
            .setTimestamp()

        await queue.textChannel.send({ embeds: [embed] });
    }
}