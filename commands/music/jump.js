const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("jump")
    .setDescription("Jump to another song!")
    .addIntegerOption(option => option
    .setName("number")
    .setDescription("Jump to a specific song ID in the queue.")
    .setRequired(true)),
    async execute(interaction, client) {
        const id = interaction.options.getInteger("number");
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
            await client.distube.jump(interaction, id);
            
            await interaction.reply({
                content: `${client.lemoji.success} | Jumped to song number ${id}!`,
            });
        } catch (err) {
            await interaction.reply({
                content: `${client.lemoji.error} | Invalid song ID!`,
                ephemeral: true
            });
        }
    }
}