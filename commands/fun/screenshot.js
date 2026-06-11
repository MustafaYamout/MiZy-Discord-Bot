const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const url = require("url");

// ------------------ BROKEN ------------------ //

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName("screenshot")
    .setDescription("Retreives a screenshot of a website! (NSFW)")
    .setNSFW(true)
    .addStringOption(option => option
    .setName("url")
    .setDescription("The URL to screenshot")
    .setRequired(true)),

    async execute(interaction, client) {
        const urls = interaction.options.getString("url");
        const site = /^(https?:\/\/)/i.test(urls) ? urls : `http://${urls}`;
        
        try {
            const { body } = await fetch(`https://api.popcat.xyz/screenshot?url=${site}`);

            const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Screenshot")
            .setDescription(`Here's a screenshot of ${urls}`)
            .setImage(body, "screenshot.png")

            await interaction.reply({
                embeds: [embed]
            });
        } catch (err) {
            console.log(err);
            
            if (err.status == 404) return await interaction.reply({
                content: "Could not find any results. Invalid URL?",
                empheral: true
            });

            await interaction.reply({
                content: `An error occured while trying to fetch the screenshot: ${err.message}`,
                empheral: true
            });
        }
    }
}