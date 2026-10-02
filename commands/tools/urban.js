const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

const API = "https://api.urbandictionary.com/v0/define?term=";

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

        try {
            const res = await fetch(API + encodeURIComponent(word));
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            if (!Array.isArray(data.list) || !data.list.length) {
                return await interaction.reply({
                    content: `❌ | I couldn't find a definition for \`${word}\`.`,
                    flags: MessageFlags.Ephemeral,
                });
            }

            const list = data.list[0];

            const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`Urban Dictionary: ${word}`)
            .setURL(`${list.permalink}`)
            .setDescription(`**Definition:** \n*${list.definition}* \n\n**Example:** \n*${list.example}*`)
            .addFields(
                { name: "Author", value: `${list.author}`, inline: true },
                { name: "Rating", value: `👍 ${list.thumbs_up} | 👎 ${list.thumbs_down}`, inline: true }
            )
            .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
            await interaction.reply({
                content: `❌ | An error occured while searching Urban Dictionary: ${err}`,
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
