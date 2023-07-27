const { SlashCommandBuilder, EmbedBuilder, parseEmoji, PermissionsBitField } = require("discord.js");
const { parse } = require("twemoji-parser");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName("stealemoji")
    .setDescription("Steal an emoji from another server!")
    .addStringOption(option => option
    .setName("emoji")
    .setDescription("The emoji you would like to steal.")
    .setRequired(true)),
    async execute(interaction, client) {
        const emoji = interaction.options.getString("emoji");
        const parsedEmoji = parseEmoji(emoji);

        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            ephemeral: true
        });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) return await interaction.reply({
            content: "❌ | You don't have the `ManageEmojisAndStickers` permission to add a role to a user!",
            ephemeral: true
        });

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) return await interaction.reply({
            content: "❌ | I don't have the `ManageEmojisAndStickers` permission to add a role to a user! Please give me this permission and try again.",
            ephemeral: true
        })

        if (parsedEmoji.id) {
            const ext = parsedEmoji.animated ? ".gif" : ".png";
            const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + ext}`;

            interaction.guild.emojis.create({
                attachment: url,
                name: parsedEmoji.name,
            }).then(emoji => {
                const embed = new EmbedBuilder()
                .setTitle("Emoji Successfully Added!")
                .setColor("Green")
                .addFields(
                    { name: "Emoji Name", value: emoji.name, inline: true },
                    { name: "Emoji ID", value: emoji.id, inline: true },
                    { name: "Emoji URL", value: `[Click Here](${emoji.url})`, inline: true }
                    )
                .setTimestamp();

                interaction.reply({
                    embeds: [embed]
                })
            })
        } else {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("ERROR: Invalid Emoji!")
                .setTimestamp();
            
            interaction.reply({
                embeds: [embed]
            })
        }
    }
}