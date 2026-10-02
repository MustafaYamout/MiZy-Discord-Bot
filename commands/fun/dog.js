const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName("dog")
    .setDescription("Posts a random dog image!"),

    async execute(interaction, client) {
        try {
            const res = await fetch("https://dog.ceo/api/breeds/image/random");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const { message: attachment } = await res.json();

            const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`[Dog pics!](https://dog.ceo/)`)
            .setImage(attachment)
            .setFooter({ text: "Powered by dog.CEO"})

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
            await interaction.reply({
                content: "❌ | I couldn't fetch a dog image right now. Please try again later.",
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
