const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leave the voice channel"),
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

        if (interaction.guild.members.me.voice.channelId !== interaction.member.voice.channelId) return interaction.reply({
            content: `${client.lemoji.error} | You are not on the same voice channel as me!`,
            ephemeral: true
        });

        if(!queue) return await interaction.reply({
            content: `${client.lemoji.error} | There is nothing playing!`,
            ephemeral: true
        });
        
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        connection.destroy();

        await interaction.reply({
            content: `${client.lemoji.success} | Successfully left the voice channel!`,
        });
    }
}