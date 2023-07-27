const { SlashCommandBuilder, EmbedBuilder, version: discordjsVersion } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Shows information about the bot!"),
    async execute(interaction, client) {
        const duration = moment.duration(client.uptime).format("\`D\`[d], \`H\`[h], \`m\`[m], \`s\`[s]");

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${client.user.username} Bot Information`)
        .setDescription("____________________________")
        .setThumbnail("https://media.discordapp.net/attachments/782648229648400424/1133440971540021278/MiZy.gif")
        .addFields(
            { name: "Information", value: `${client.user.username} is a multi-purpose Discord bot with over 70 commands, ready to enlighten your server!`, inline: false },
            { name: "_____ \n\n│General", value: `_____`, inline: false },
            { name: "Bot Name", value: `${client.user.tag}`, inline: true },
            { name: "Shards", value: `${client.options.shardCount} shard(s)`, inline: true },
            { name: "Bot Creator", value: `<@267299812339220480>`, inline: true },
            { name: "Servers", value: `${client.guilds.cache.size}`, inline: true },
            { name: "Commands", value: `${client.commands.size}`, inline: true },
            { name: "Uptime", value: `${duration}`, inline: true },
            { name: "Websocket Ping", value: `${client.ws.ping}ms`, inline: true },
            { name: "Memory", value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB Heap`, inline: true },
            { name: "Node", value: `${process.version} on ${process.platform} ${process.arch}`, inline: true },
            { name: "Discord.js Version", value: `${discordjsVersion}`, inline: true },
            { name: "Links", value: `[Add MiZy](https://discord.com/oauth2/authorize?client_id=752384586398302279&scope=bot&permissions=1007021182) \n[Support Server](https://discord.gg/VJE4AwyThA)`, inline: true },
        )
        .setTimestamp()

        await interaction.reply({
            embeds: [embed]
        });
    }
}