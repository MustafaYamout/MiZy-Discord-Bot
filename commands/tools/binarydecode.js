const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

const decode = (binary) => {
    const bits = binary.replace(/[^01]/g, "");

    if (bits.length === 0) throw new Error("that does not contain any 0s or 1s");
    if (bits.length % 8 !== 0) {
        throw new Error(`that is ${bits.length} digits, which is not a whole number of bytes`);
    }

    return Buffer.from(bits.match(/.{8}/g).map((group) => parseInt(group, 2))).toString("utf8");
};

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName("binarydecode")
    .setDescription("Decode binary to string!")
    .addStringOption(option => option
    .setName("binary")
    .setDescription("The binary you would like to decode.")
    .setMaxLength(1000)
    .setRequired(true)),
    async execute(interaction, client) {
        const numbers = interaction.options.getString("binary");

        let output;
        try {
            output = decode(numbers);
        } catch (err) {
            return await interaction.reply({
                content: `❌ | I couldn't decode that — ${err.message}.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Binary Decode")
        .addFields(
            { name: "Input", value: `\`\`\`${numbers.slice(0, 1000)}\`\`\``, inline: false },
            { name: "Output", value: `\`\`\`${output.slice(0, 1000)}\`\`\``, inline: false },
        )
        .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
}
