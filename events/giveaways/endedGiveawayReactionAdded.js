const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "endedGiveawayReactionAdded",
    async execute(giveaway, member, reaction, client) {
        const url = `https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}`

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle(`${client.lemoji.error} | Sorry!`)
            .setDescription(`This [Giveaway](${url}) has already ended!`)
            .setTimestamp()

        await reaction.users.remove(member.user.id).catch(() => {});

        member.send({ embeds: [embed] }).catch(() => {});
    }
}
