const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "giveawayRerolled",
    async execute(giveaway, winners, client) {
        const url = `https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}`

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`🎉 | Congratulations!`)
            .setDescription(`You have won the [Giveaway!](${url})\n Your prize is: \`**${giveaway.prize}**\`!`)
            .setTimestamp()

        winners.forEach((winner) => {
            winner.send({ embeds: [embed] })
        });
    }
}