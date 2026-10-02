const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

const encode = (text) =>
    [...Buffer.from(text, "utf8")]
        .map((byte) => byte.toString(2).padStart(8, "0"))
        .join(" ");

const MAX_OUTPUT = 1000;
const MAX_INPUT = Math.floor((MAX_OUTPUT + 1) / 9);

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName("binaryencode")
    .setDescription("Encode a string to binary!")
    .addStringOption(option => option
    .setName("text")
    .setDescription("The text you would like to encode.")
    .setMaxLength(111)
    .setRequired(true)),
    async execute(interaction, client) {
        const text = interaction.options.getString("text");
        const output = encode(text);

        if (!output) {
            return await interaction.reply({
                content: "❌ | I couldn't encode that text.",
                flags: MessageFlags.Ephemeral,
            });
        }

        if (output.length > MAX_OUTPUT) {
            return await interaction.reply({
                content: `❌ | That is too long to encode — the output is ${output.length} characters and the limit is ${MAX_OUTPUT}. Try ${MAX_INPUT} characters or fewer.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Binary Encode")
        .addFields(
            { name: "Input", value: `\`\`\`${text}\`\`\``, inline: false },
            { name: "Output", value: `\`\`\`${output}\`\`\``, inline: false },
        )
        .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
}
