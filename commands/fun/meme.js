const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");
const fetch = require("node-fetch");
let url = "https://www.reddit.com/r/memes"

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Retreives a random meme from a r/memes subreddit!"),

    async execute(interaction, client) {
        const res = await fetch(url + `.json?limit=100&?sort=top&t=week`);
        let json = await res.json();
        let i = Math.floor(Math.random() * json.data.children.length);
        let img = json.data.children[i].data.url
        let caption = json.data.children[i].data.title

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(caption)
        .setImage(img, "meme.png")
        .setFooter({ text: `👍 ${json.data.children[i].data.ups} | 💬 ${json.data.children[i].data.num_comments}` })

        await interaction.reply({
            embeds: [embed]
        })
    }
}