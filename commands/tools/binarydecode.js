const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const binary = require("decode-encode-binary");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName("binarydecode")
    .setDescription("Decode binary to string!")
    .addStringOption(option => option
    .setName("binary")
    .setDescription("The binary you would like to decode.")
    .setRequired(true)),
    async execute(interaction, client) {
        const numbers = interaction.options.getString("binary");

        const outputResponse = `\`\`\`${binary.auto(numbers, true)}\n\`\`\``;

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Binary Decode")            
        .setFields(        
            { name: "Input", value: `\`\`\`${numbers}\`\`\`` , inline: false },       
            { name: "Output", value: outputResponse.substr(0, 1024), inline: false },        
        )
        .setTimestamp();
        
        await interaction.reply({
            embeds: [embed]
        })
    }
}