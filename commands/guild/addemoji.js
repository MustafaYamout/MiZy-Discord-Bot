const { SlashCommandBuilder, EmbedBuilder, parseEmoji, PermissionsBitField, MessageFlags } = require("discord.js");

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
        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            flags: MessageFlags.Ephemeral,
        });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) return await interaction.reply({
            content: "❌ | You don't have the `ManageEmojisAndStickers` permission to steal an emoji!",
            flags: MessageFlags.Ephemeral,
        });

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) return await interaction.reply({
            content: "❌ | I don't have the `ManageEmojisAndStickers` permission to steal an emoji! Please give me this permission and try again.",
            flags: MessageFlags.Ephemeral,
        });

        const emoji = interaction.options.getString("emoji");
        const parsedEmoji = parseEmoji(emoji);

        if (!parsedEmoji || !parsedEmoji.id) {
            return await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("ERROR: Invalid Emoji!")
                    .setDescription("You can only steal **custom** server emojis. Copy one from another server and paste it here.")
                    .setTimestamp()]
            });
        }

        const ext = parsedEmoji.animated ? ".gif" : ".png";
        const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id}${ext}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to download the emoji (HTTP ${response.status})`);
            const buffer = Buffer.from(await response.arrayBuffer());

            const created = await interaction.guild.emojis.create({
                attachment: buffer,
                name: parsedEmoji.name,
            });

            const embed = new EmbedBuilder()
            .setTitle("Emoji Successfully Added!")
            .setColor("Green")
            .addFields(
                { name: "Emoji Name", value: created.name, inline: true },
                { name: "Emoji ID", value: created.id, inline: true },
                { name: "Emoji URL", value: `[Click Here](${created.imageURL()})`, inline: true }
            )
            .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
            await interaction.reply({
                content: "❌ | I couldn't add that emoji. It may be too large, or already in this server.",
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
