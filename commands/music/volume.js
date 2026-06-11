const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const progressbar = require("string-progressbar");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Set volume of the song!")
    .addIntegerOption(option => option
    .setName("volume")
    .setMinValue(0)
    .setMaxValue(100)
    .setDescription("The volume you want to set!")
    .setRequired(true)),
    async execute(interaction, client) {
        const volume = interaction.options.getInteger("volume")
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

        await client.distube.setVolume(interaction, volume);
        const max = 100;
        const current = volume;

        const bar = progressbar.splitBar(max, current, 20, "▬", "🔘")[0];

        const embed = new EmbedBuilder()
        .setTitle("✅ | New Volume set!")
        .setColor("Green")
        .setDescription(`\`${bar}\` \n Set the volume to \`${volume}\``)
        .setTimestamp()

        await interaction.reply({
            embeds: [embed]
        });
    }
}