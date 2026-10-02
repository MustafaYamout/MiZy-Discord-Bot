const { SlashCommandBuilder, MessageFlags } = require("discord.js");

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
        const ctx = client.voiceContext(interaction, client, { requireQueue: false });
        if (!ctx) return;

        const { voiceChannel } = ctx;
        const query = interaction.options.getString("query");

        try {
            await interaction.deferReply();

            await client.distube.play(voiceChannel, query, {
                textChannel: interaction.channel,
                member: interaction.member,
            });
        } catch (err) {
            console.log(err);

            const content = `${client.lemoji.error} | An error occured while playing the song: ${err}`;

            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({ content });
            } else {
                await interaction.reply({ content, flags: MessageFlags.Ephemeral });
            }
        }
    }
}
