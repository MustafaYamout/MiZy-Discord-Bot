const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName("fox")
    .setDescription("Posts a random fox image!"),

    async execute(interaction, client) {
        try {
            const res = await fetch("https://randomfox.ca/floof/");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const { image: attachment } = await res.json();

            const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`[Fox pics!](https://randomfox.ca/)`)
            .setImage(attachment)
            .setFooter({ text: "Powered by randomfox.ca"})

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
            await interaction.reply({
                content: "❌ | I couldn't fetch a fox image right now. Please try again later.",
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
