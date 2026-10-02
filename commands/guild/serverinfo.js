const { SlashCommandBuilder, EmbedBuilder, ChannelType, MessageFlags } = require("discord.js");

const boostTier = {
    "0": "None",
    "1": "Tier 1",
    "2": "Tier 2",
    "3": "Tier 3"
}
const verificationLevel = {
    "0": "None",
    "1": "Low",
    "2": "Medium",
    "3": "High",
    "4": "Highest"
}

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Shows information about the guild!"),
    async execute(interaction, client) {
        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            flags: MessageFlags.Ephemeral,
        });

        const guild = interaction.guild;
        const countChannels = (...types) => guild.channels.cache.filter(c => types.includes(c.type)).size;

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${guild.name} Information`)
        .setDescription("____________________________")
        .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
        .setImage(guild.bannerURL({ size: 1024 }))
        .addFields(
            { name: "Server name", value: `${guild.name}`, inline: true },
            { name: "Server ID", value: `${guild.id}`, inline: true },
            { name: "Boost tier", value: `${boostTier[guild.premiumTier] ?? "Unknown"}`, inline: true },
            { name: "Boost count", value: `${guild.premiumSubscriptionCount || 0}`, inline: true },
            { name: "Verification level", value: `${verificationLevel[guild.verificationLevel] ?? "Unknown"}`, inline: true },
            { name: "Members", value: `${guild.memberCount} Members`, inline: true },
            { name: "Created on", value: `<t:${Math.round(guild.createdTimestamp / 1000)}:F>`, inline: true },
            { name: "Text Channels", value: `${countChannels(ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.GuildForum, ChannelType.GuildMedia)}`, inline: true },
            { name: "Voice Channels", value: `${countChannels(ChannelType.GuildVoice, ChannelType.GuildStageVoice)}`, inline: true },
            { name: "Categories", value: `${countChannels(ChannelType.GuildCategory)}`, inline: true },
            { name: "Roles", value: `${guild.roles.cache.size}`, inline: true },
            { name: "Emojis", value: `${guild.emojis.cache.size}`, inline: true },
            { name: "Stickers", value: `${guild.stickers.cache.size}`, inline: true },
        )
        .setTimestamp()

        await interaction.reply({ embeds: [embed] });
    }
}
