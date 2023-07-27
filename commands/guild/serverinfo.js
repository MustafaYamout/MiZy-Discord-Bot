const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require("discord.js");
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
        const members = await interaction.guild.members.fetch();
        
        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            ephemeral: true
        });

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${interaction.guild.name} Information`)
        .setDescription("____________________________")
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
        .setImage(interaction.guild.bannerURL({ size: 1024 }))
        .addFields(
            { name: "Server name", value: `${interaction.guild.name}`, inline: true },
            { name: "Server ID", value: `${interaction.guild.id}`, inline: true },
            { name: "Server Owner", value: `<@${interaction.guild.ownerId}>`, inline: true },
            { name: "Boost tier", value: `${boostTier[interaction.guild.premiumTier]}`, inline: true },
            { name: "Boost count", value: `${interaction.guild.premiumSubscriptionCount || "0"}`, inline: true },
            { name: "Verification level", value: `${verificationLevel[interaction.guild.verificationLevel]}`, inline: true },
            { name: "Members", value: `${interaction.guild.memberCount} Members`, inline: true },
            { name: "Created on", value: `<t:${Math.round(interaction.guild.createdTimestamp / 1000)}>`, inline: true },
            { name: "Text Channels", value: `${interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size}`, inline: true },
            { name: "Voice Channels", value: `${interaction.guild.channels.cache.filter(channel => channel.type ===  ChannelType.GuildVoice).size}`, inline: true },
            { name: "Roles", value: `${interaction.guild.roles.cache.size}`, inline: true },
            { name: "Emojis", value: `${interaction.guild.stickers.cache.size}`, inline: true },
        )
        .setTimestamp()

        await interaction.reply({
            embeds: [embed]
        });
    }
}