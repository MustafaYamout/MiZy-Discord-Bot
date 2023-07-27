const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const url = "https://api.urbandictionary.com/v0/define?term=";

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName("urban")
    .setDescription("Search a word in the Urban Dictonary! (NSFW)")
    .setNSFW(true)
    .addStringOption(option => option
    .setName("word")
    .setDescription("The word you would like to search up.")
    .setRequired(true)),
    async execute(interaction, client) {
        const word = interaction.options.getString("word");
        
        const res = await fetch(url + word);
        const data = await res.json();
        const list = data.list[0]
        const definition = list.definition;
        const link = list.permalink;
        const example = list.example;
        const author = list.author;
        const thumbsup = list.thumbs_up;
        const thumbsdown = list.thumbs_down;


        const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`Urban Dictionary: ${word}`)
        .setURL(`${link}`)
        .setDescription(`**Definition:** \n*${definition}* \n\n**Example:** \n*${example}*`)
        .addFields(
            { name: "Author", value: `${author}`, inline: true },
            { name: "Rating", value: `👍 ${thumbsup} | 👎 ${thumbsdown}`, inline: true }
            )
        .setTimestamp();
        
        await interaction.reply({
            embeds: [embed]
        })
    }
}