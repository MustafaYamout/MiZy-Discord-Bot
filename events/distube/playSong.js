const { EmbedBuilder } = require("discord.js");
const { RepeatMode } = require("distube");

const ALBUM_ART = `https://cdn.discordapp.com/attachments/823926123750621212/1133015214317649990/musicCD.gif`;

const status = (queue) => `Volume: \`${queue.volume}%\` | Loop: \`${queue.repeatMode === RepeatMode.QUEUE ? "All Queue" : queue.repeatMode === RepeatMode.SONG ? "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

const orUnknown = (value) => (value === undefined || value === null ? "Unknown" : value.toString());

module.exports = {
    name: "playSong",
    async execute(queue, song, client) {

        const streamURL = song.stream && song.stream.url;

        const embed = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: "Started Playing", iconURL: ALBUM_ART })
            .setThumbnail(song.thumbnail)
            .setDescription(`[${song.name}](${song.url})`)
            .addFields(
                { name: "**Views:**", value: orUnknown(song.views), inline: true },
                { name: "**Likes:**", value: orUnknown(song.likes), inline: true },
                { name: "**Duration:**", value: orUnknown(song.formattedDuration), inline: true },
                { name: "**Status**", value: status(queue), inline: true },
                { name: "**Link**", value: streamURL ? `[Download Song Here](${streamURL})` : "Unavailable", inline: true },
            )
            .setFooter({ text: `Requested by ${song.user.username}`, iconURL: song.user.displayAvatarURL() })
            .setTimestamp()

        await queue.textChannel.send({ embeds: [embed] }).catch(() => {});
    }
}
