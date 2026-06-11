const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get the avatar of a user.")
    .addUserOption(option => option
    .setName("user")
    .setDescription("The user you want to get the avatar of.")
    .setRequired(false)),
    async execute(interaction, client) {
        const user = interaction.options.getUser("user") || interaction.user;

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: user.tag,
            iconURL: user.displayAvatarURL({ dynamic: true })
        })
        .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))

        await interaction.reply({
            embeds: [embed]
        })
    }
}