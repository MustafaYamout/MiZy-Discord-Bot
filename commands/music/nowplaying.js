const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const status = (queue) => `Volume: \`${queue.volume}%\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Shows information about the current playing song!"),
    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction);
        const voiceChannel = interaction.member.voice.channel;

        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            ephemeral: true
        });

        if (!voiceChannel) return await interaction.reply({
            content: "❌ | You must be in a voice channel to use this command!",
            ephemeral: true
        });

        if(!queue) return await interaction.reply({
            content: `${client.lemoji.error} | There is nothing playing!`,
            ephemeral: true
        });

        if (interaction.guild.members.me.voice.channelId !== interaction.member.voice.channelId) return interaction.reply({
            content: `${client.lemoji.error} | You are not on the same voice channel as me!`,
            ephemeral: true
        });

        const song = queue.songs[0];

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
                { name: "**Link**", value: `[Download Song Here](${song.streamURL})`, inline: true }
            )
            .setFooter({ text: `Requested by ${song.user.username}`, iconURL: song.user.avatarURL() })
            .setTimestamp()
        
        await interaction.reply({
            embeds: [embed]
        });
    }
}