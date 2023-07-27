const { EmbedBuilder } = require("discord.js");
const status = (queue) => `Volume: \`${queue.volume}%\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``

module.exports = {
    name: "playSong",
    async execute(queue, song, client) {

        const embed = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: "Started Playing", iconURL: "https://media.discordapp.net/attachments/823926123750621212/1133015214317649990/musicCD.gif" })
            .setThumbnail(song.thumbnail)
            .setDescription(`[${song.name}](${song.url})`)
            .addFields(
                { name: "**Views:**", value: song.views.toString(), inline: true },
                { name: "**Likes:**", value: song.likes.toString(), inline: true },
                { name: "**Duration:**", value: song.formattedDuration.toString(), inline: true },
                { name: "**Status**", value: status(queue).toString(), inline: true },
                { name: "**Link**", value: `[Download Song Here](${song.streamURL})`, inline: true },
            )
            .setFooter({ text: `Requested by ${song.user.username}`, iconURL: song.user.avatarURL() })
            .setTimestamp()

        await queue.textChannel.send({ embeds: [embed] });
    }
}