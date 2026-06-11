const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("previous")
    .setDescription("Resume the paused song!"),
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

        try {

            await client.distube.previous(interaction);

            await interaction.reply({
                content: `${client.lemoji.play} | Started playing the previous song!`
            });

        } catch (err) {
            console.log(err)
            await interaction.reply({
                content: `${client.lemoji.error} | There is no previous song in this queue...`,
                ephemeral: true
            });
        }
    }
}