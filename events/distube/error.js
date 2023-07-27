const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "error",
    async execute(textChannel, err) {
        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle(`❌ | An error occurred!`)
            .setDescription(`Error: ${err}`)
            .setTimestamp()

        await textChannel.send({ embeds: [embed] });
    }
}