const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "endedGiveawayReactionAdded",
    async execute(giveaway, member, reaction, client) {
        const url = `https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}`

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle(`${client.lemoji.success} | Success!`)
            .setDescription(`You have entered [Giveaway](${url}), Good luck!`)
            .setTimestamp()

        reaction.users.remove(member.user);

        member.send({ embeds: [embed] })


    }
}