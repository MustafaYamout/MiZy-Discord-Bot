const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const popcat = require("popcat-wrapper");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName("npm")
    .setDescription("Search for an NPM package!")
    .addStringOption(option => option
    .setName("package")
    .setDescription("The NPM package you would like to search up.")
    .setRequired(true)),
    async execute(interaction, client) {
        const packageName = interaction.options.getString("package");
        const npmurl = "https://media.discordapp.net/attachments/782648229648400424/1133441748924907550/npm.png?width=427&height=427"

        let npm;
        try {
            npm = await popcat.npm(packageName);
        } catch (err) {
            console.log(err);
            return await interaction.reply({
                content: `${client.lemoji.error} | An error occured while searching for the package: ${err}`,
                flags: MessageFlags.Ephemeral,
            });
        }

        const field = (name, value) => ({ name, value: String(value ?? "N/A").slice(0, 1024), inline: true });

        const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle(`Information about ${npm.name}`)
        .setThumbnail(npmurl)
        .addFields(
            field("Name:", npm.name),
            field("Description:", npm.description),
            field("Version:", npm.version),
            field("Downloads This Year:", npm.downloads_this_year),
            field("Maintainers:", npm.maintainers),
            field("Author:", npm.author),
            field("Author email:", npm.author_email),
            field("Resporitory:", npm.repository),
            field("Last published:", npm.last_published),
        )
        .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
}
