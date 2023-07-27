const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");


module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Replies with support server and Bot invite link!"),
    async execute(interaction, client) {
        
        const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Important Links")
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setDescription("____________________________")
        .addFields(
            { name: "Server Link", value: `[Click Here](https://discord.gg/VJE4AwyThA)`, inline: true },
            { name: "Invite Link", value: `[Click Here](https://discord.com/oauth2/authorize?client_id=752384586398302279&scope=bot&permissions=1007021182)`, inline: true },
            { name: "Support us by voting MiZy on Top.gg!", value: `[MiZy on Top.gg](https://top.gg/bot/752384586398302279)`, inline: true },
        )

        await interaction.reply({
            embeds: [embed]
        })
    }
}