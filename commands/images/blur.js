const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const sharp = require("sharp");

const blurSigma = (width) => Math.max(6, Math.min(40, width / 24));

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

        try {
            const avatar = user.displayAvatarURL({ dynamic: false, format: "png", size: 4096 });

            const response = await fetch(avatar);
            if (!response.ok) throw new Error(`Failed to download the avatar (HTTP ${response.status})`);

            const original = Buffer.from(await response.arrayBuffer());
            const { width } = await sharp(original).metadata();
            const blurred = await sharp(original)
                .blur(blurSigma(width || 256))
                .png()
                .toBuffer();

            const embed = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setDescription("🔫 | Whoops!")

            .setImage("attachment://blur.png")

            await interaction.reply({
                embeds: [embed],
                files: [{ attachment: blurred, name: "blur.png" }],
            });
        } catch (err) {
            console.log(err);
            await interaction.reply({
                content: "❌ | I couldn't blur that avatar. Please try again later.",
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
