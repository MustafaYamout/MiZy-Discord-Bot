const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

const SCREENSHOT_API = "https://api.microlink.io/";

module.exports = {
    cooldown: 60,
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
            const query = new URLSearchParams({ url: site, screenshot: "true", meta: "false" });

            const res = await fetch(`${SCREENSHOT_API}?${query}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const body = await res.json();

            if (body.status !== "success") {
                const reason = body.data?.error || body.message || "the site could not be reached";
                throw new Error(reason);
            }

            const shot = body.data?.screenshot;
            if (!shot?.url) throw new Error("no screenshot was returned");

            const image = await fetch(shot.url);
            if (!image.ok) throw new Error(`HTTP ${image.status} downloading the screenshot`);

            const buffer = Buffer.from(await image.arrayBuffer());

            const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Screenshot")
            .setDescription(`Here's a screenshot of ${urls}`)
            .setImage("attachment://screenshot.png")

            await interaction.reply({
                embeds: [embed],
                files: [{ attachment: buffer, name: "screenshot.png" }],
                flags: MessageFlags.Ephemeral,
            });
        } catch (err) {
            console.log(err);

            const content = err.message && err.message.startsWith("HTTP 404")
                ? "Could not find any results. Invalid URL?"
                : `An error occured while trying to fetch the screenshot: ${err.message}`;

            await interaction.reply({ content, flags: MessageFlags.Ephemeral });
        }
    }
}
