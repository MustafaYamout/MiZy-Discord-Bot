const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType, MessageFlags } = require("discord.js");
const ms = require("ms");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start a giveaway!")
    .addChannelOption(option => option
    .setName("channel")
    .setDescription("Input the channel you would like to start the giveaway in.")
    .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
    .setRequired(true))
    .addStringOption(option => option
    .setName("duration")
    .setDescription("Input the duration of the giveaway. (E.g. 1d / 1h / 1m / 1s)")
    .setRequired(true))
    .addIntegerOption(option => option
    .setName("winners")
    .setDescription("Input the amount of winners you would like to have.")
    .setMinValue(1)
    .setMaxValue(15)
    .setRequired(true))
    .addStringOption(option => option
    .setName("prize")
    .setDescription("Input the prize you would like to giveaway.")
    .setRequired(true)),
    async execute(interaction, client) {
        if (!interaction.inGuild()) return await interaction.reply({
            content: "❌ | This command can only be used in a server!",
            flags: MessageFlags.Ephemeral,
        });

        const allowed = interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)
            || interaction.member.roles.cache.some(role => role.name === "Giveaways");

        if (!allowed) return await interaction.reply({
            content: "❌ | You need the `ManageGuild` permission or the `Giveaways` role to start a giveaway!",
            flags: MessageFlags.Ephemeral,
        });

        const channel = interaction.options.getChannel("channel");
        const duration = interaction.options.getString("duration");
        const winners = interaction.options.getInteger("winners");
        const prize = interaction.options.getString("prize");

        const durationMs = ms(duration);
        if (!durationMs) return await interaction.reply({
            content: "❌ | I couldn't parse that duration. Try something like `1d`, `1h`, `1m` or `30s`.",
            flags: MessageFlags.Ephemeral,
        });

        const thumbnail = interaction.guild.iconURL({ dynamic: true, size: 1024 });

        try {
            await client.giveaways.start(channel, {
                duration: durationMs,
                prize: `🎁 | ${prize}`,
                winnerCount: winners,
                hostedBy: interaction.user,
                ...(thumbnail ? { thumbnail } : {}),
                messages: {
                    giveaway: "🎉 **GIVEAWAY** 🎉",
                    giveawayEnded: "🎉 **GIVEAWAY ENDED** 🎉",
                    drawing: `⏱ | Ends in {timestamp}!`,
                    inviteToParticipate: "React with 🎉 to participate in this giveaway!\n",
                    winMessage: `🎉 | Congratulations, {winners}! You've won **${prize}**!`,
                    embedFooter: "Giveaway",
                    embedColor: "#4437db",
                    noWinner: "❌ | Giveaway cancelled, no valid participations.\n",
                    hostedBy: `Hosted by: ${interaction.user.username}`,
                    winners: "🏆 | Winner(s): ",
                    endedAt: "Ended at:",
                    units: {
                        seconds: "seconds",
                        minutes: "minutes",
                        hours: "hours",
                        days: "days",
                        pluralS: false
                    },
                    pauseOptions: {
                        isPaused: false,
                        content: "⏸ | The giveaway is paused!",
                        embedColor: "#bcd4d4",
                        unPauseAfter: null
                    },
                    lastChance: {
                        enabled: true,
                        content: "⚠️ | **LAST CHANCE TO ENTER !** ⚠️",
                        embedColor: "#FF0000",
                        threshold: 5000
                    },
                },
            });

            const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`✅ | Giveaway started in ${channel}!`)
            .setTimestamp()

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
            await interaction.reply({
                content: "❌ | I couldn't start that giveaway. Please try again.",
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
