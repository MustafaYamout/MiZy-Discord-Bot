const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");
const popcat = require("popcat-wrapper");

// ------------------ BROKEN ------------------ //
// reason: Canvacord unable to use Canvas class //

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName("blur")
    .setDescription("Blur someone's avatar!")
    .addUserOption(option => option
    .setName("user")
    .setDescription("The user you want to blur.")
    .setRequired(false)),
    async execute(interaction, client) {
        const user = interaction.options.getUser("user") || interaction.user;
        let avatar = user.displayAvatarURL({ dynamic: false, format: "png", size: 4096 });
        const blur = await popcat.blur(avatar);

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: user.tag,
            iconURL: user.displayAvatarURL({ dynamic: true })
        })
        .setImage(blur, "blur.png")

        await interaction.reply({
            embeds: [embed]
        })
    }
}