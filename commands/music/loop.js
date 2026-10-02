const { SlashCommandBuilder } = require("discord.js");
const { RepeatMode } = require("distube");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Loop the songs!"),
    async execute(interaction, client) {
        if (!client.voiceContext(interaction, client)) return;

        const mode = client.distube.setRepeatMode(interaction);
        const label = mode === RepeatMode.QUEUE ? "Repeat queue" : mode === RepeatMode.SONG ? "Repeat song" : "Off";

        await interaction.reply({
            content: `${client.lemoji.repeat} | Set repeat mode to \`${label}\``,
        });
    }
}
