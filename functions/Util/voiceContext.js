const { MessageFlags } = require("discord.js");

function voiceContext(interaction, client, { requireQueue = true } = {}) {
    if (!interaction.inGuild()) {
        interaction.reply({
            content: "❌ | This command can only be used in a server!",
            flags: MessageFlags.Ephemeral,
        });
        return null;
    }

    const member = interaction.member;
    const voiceChannel = member && member.voice && member.voice.channel;

    if (!voiceChannel) {
        interaction.reply({
            content: "❌ | You must be in a voice channel to use this command!",
            flags: MessageFlags.Ephemeral,
        });
        return null;
    }

    const queue = client.distube.getQueue(interaction);

    if (requireQueue && !queue) {
        interaction.reply({
            content: `${client.lemoji.error} | There is nothing playing!`,
            flags: MessageFlags.Ephemeral,
        });
        return null;
    }

    const meChannelId = interaction.guild.members.me.voice.channelId;
    if (meChannelId && meChannelId !== voiceChannel.id) {
        interaction.reply({
            content: `${client.lemoji.error} | You are not on the same voice channel as me!`,
            flags: MessageFlags.Ephemeral,
        });
        return null;
    }

    return { queue, voiceChannel };
}

module.exports = (client) => {
    client.voiceContext = voiceContext;
};
