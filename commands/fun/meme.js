const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

const SUBREDDIT = "https://www.reddit.com/r/memes";

const HEADERS = { "User-Agent": "MiZyDiscordBot/1.0" };

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Retreives a random meme from a r/memes subreddit!"),

    async execute(interaction, client) {
        try {
            const res = await fetch(`${SUBREDDIT}.json?limit=100&sort=top&t=week`, { headers: HEADERS });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const json = await res.json();
            const children = json?.data?.children;

            if (!Array.isArray(children) || !children.length) {
                throw new Error("No posts returned");
            }

            const withImage = children.filter((c) => c.data.url && c.data.post_hint === "image");
            if (!withImage.length) throw new Error("No image posts returned");

            const post = withImage[Math.floor(Math.random() * withImage.length)];
            const { url: img, title: caption, ups, num_comments: numComments } = post.data;

            const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(caption)
            .setURL(`https://www.reddit.com${post.data.permalink}`)
            .setImage(img)
            .setFooter({ text: `👍 ${ups} | 💬 ${numComments}` })

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
            await interaction.reply({
                content: "❌ | I couldn't fetch a meme right now. Please try again later.",
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
