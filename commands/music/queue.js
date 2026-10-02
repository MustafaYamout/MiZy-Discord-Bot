const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

const MAX_LENGTH = 4000;
const MAX_SONGS = 25;

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Check the queue!"),
    async execute(interaction, client) {
        const ctx = client.voiceContext(interaction, client);
        if (!ctx) return;

        const { queue } = ctx;

        if (!queue.songs.length) {
            return await interaction.reply({
                content: `${client.lemoji.error} | There is nothing playing!`,
                flags: MessageFlags.Ephemeral,
            });
        }

        const shown = queue.songs.slice(0, MAX_SONGS);
        const hidden = queue.songs.length - shown.length;

        let list = shown.map((song, id) => {
            return `${id === 0 ? "Playing:" : `${id}.`} ${song.name} - \`${song.formattedDuration}\``
        }).join("\n");

        if (list.length > MAX_LENGTH) list = `${list.slice(0, MAX_LENGTH)}\n…`;

        const footer = [
            `${queue.songs.length} song(s) in the queue`,
            hidden > 0 ? `showing the first ${MAX_SONGS}` : null,
            `Volume: ${queue.volume}%`,
        ].filter(Boolean).join(" | ");

        const embed = new EmbedBuilder()
        .setTitle(`${client.lemoji.queue} | Current Queue:`)
        .setDescription(`${list}`)
        .setColor("Random")
        .setFooter({ text: footer })
        .setTimestamp()

        await interaction.reply({ embeds: [embed] });
    }
}
