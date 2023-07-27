const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song!")
    .addStringOption(option => option
    .setName("query")
    .setDescription("The song you want to play.")
    .setRequired(true)),
    async execute(interaction, client) {
        const query = interaction.options.getString("query");
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

        try {
            await interaction.reply({
                content: `⏱ | Searching your query..`
            })
            await interaction.editReply({
                content: `${client.lemoji.success} | Search completed!`
            })

            client.distube.voices.join(voiceChannel)
            await client.distube.play(voiceChannel, query, {
                textChannel: interaction.channel,
                member: interaction.member
            });

        } catch (err) {
            console.log(err)
            interaction.reply({
                content: `${client.lemoji.error} | An error occured while playing the song: ${err}`,
                ephemeral: true
            });
        }
    }
}