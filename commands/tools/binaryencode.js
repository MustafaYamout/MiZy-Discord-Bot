const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const binary = require("decode-encode-binary");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName("binaryencode")
    .setDescription("Encode a string to binary!")
    .addStringOption(option => option
    .setName("text")
    .setDescription("The text you would like to encode.")
    .setRequired(true)),
    async execute(interaction, client) {
        const text = interaction.options.getString("text");

        const outputResponse = `\`\`\`${binary.auto(text, true)}\n\`\`\``;

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Binary Encode")            
        .setFields(        
            { name: "Input", value: `\`\`\`${text}\`\`\`` , inline: false },       
            { name: "Output", value: outputResponse.substr(0, 1024), inline: false },        
        )
        .setTimestamp();
        
        await interaction.reply({
            embeds: [embed]
        })
    }
}