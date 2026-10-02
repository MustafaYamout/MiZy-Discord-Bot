const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "giveawayReactionAdded",
    async execute(giveaway, member, reaction, client) {
        const url = `https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}`

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`${client.lemoji.success} | Success!`)
            .setDescription(`You have entered [Giveaway](${url}), Good luck!`)
            .setTimestamp()

        member.send({ embeds: [embed] }).catch(() => {});
    }
}
