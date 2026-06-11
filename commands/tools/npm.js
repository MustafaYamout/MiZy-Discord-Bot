const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
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
        const package = interaction.options.getString("package");
        const npmurl = "https://media.discordapp.net/attachments/782648229648400424/1133441748924907550/npm.png?width=427&height=427"

        const npm = await popcat.npm(package).catch((err) => {
            return interaction.reply({
                content: `${client.lemoji.error} | An error occured while searching for the package: ${err}`,
                ephemeral: true
            });
        });

        const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle(`Information about ${npm.name}`)
        .setThumbnail(npmurl)
        .addFields(
            { name: "Name:", value: `${npm.name}`, inline: true },
            { name: "Description:", value: `${npm.description}`, inline: true },
            { name: "Version:", value: `${npm.version}`, inline: true },
            { name: "Downloads This Year:", value: `${npm.downloads_this_year}`, inline: true },
            { name: "Maintainers:", value: `${npm.maintainers}`, inline: true },
            { name: "Author:", value: `${npm.author}`, inline: true },
            { name: "Author email:", value: `${npm.author_email}`, inline: true },
            { name: "Resporitory:", value: `${npm.repository}`, inline: true },
            { name: "Last published:", value: `${npm.last_published}`, inline: true },
        )
        .setTimestamp();
        
        await interaction.reply({
            embeds: [embed]
        })
    }
}