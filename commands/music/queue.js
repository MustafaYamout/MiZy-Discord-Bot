const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Check the queue!"),
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
        
        const list = queue.songs.map((song, id) => {
            return `${id === 0 ? "Playing:" : `${id}.`} ${song.name} - \`${song.formattedDuration}\``
        }).join("\n")

        const embed = new EmbedBuilder()
        .setTitle(`${client.lemoji.queue} | Current Queue:`)
        .setDescription(`${list}`)
        .setColor("Random")
        .setTimestamp()

        await interaction.reply({
            embeds: [embed]
        });
    }
}