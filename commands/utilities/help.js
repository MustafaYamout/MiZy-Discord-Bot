const { ComponentType, EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const emojis = {
    "utilities": "🔧",
    "fun": "🎉",
    "images": "🖼️",
    "moderation": "🛡️",
    "developers": "👨‍💻",
    "bot": "🤖",
    "music": "🎵",
    "economy": "💰",
    "giveaway": "🎉",
    "guild": "🏰",
    "tools": "🔨",
}

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides information for each command."),
    
    async execute(interaction, client) {
        const directories = [...new Set(client.commands.map(command => command.folder))];

        const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`

        const categories = directories.map((dir) => {
            const getCommands = client.commands.filter((cmd) => cmd.folder === dir).map((cmd) => {
                return {
                    name: cmd.data.name,
                    description: cmd.data.description || "No description provided."
                };
            });

            return {
                directory: formatString(dir),
                commands: getCommands
            };
        });


        const embed = new EmbedBuilder()
        .setTitle("Help Menu")
        .setColor("Random")
        .setDescription("Select a category to view the commands in that category.")
        .setFooter({ text: "Made with ❤️ by SetItOnZygote"});

        const components = (state) => [
            new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId("help-menu")
                .setPlaceholder("Select a category")
                .setDisabled(state)
                .addOptions(
                    categories.map((cmd) => {
                        return {
                            label: cmd.directory,
                            value: cmd.directory.toLowerCase(),
                            emoji: emojis[cmd.directory.toLowerCase() || null],
                            description: `Commands in the ${cmd.directory} Category.`
                        }
                    })
            
                )
            
            )
        ]

        const initialMessage = await interaction.reply({
            embeds: [embed],
            components: components(false)
        });

        const filter = (interaction) => interaction.user.id === interaction.member.id;

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            ComponentType: ComponentType.StringSelect
        });

        collector.on("collect", (interaction) => {
            const [ directory ] = interaction.values;

            const category = categories.find((x) => x.directory.toLowerCase() === directory);

            const categoryEmbed = new EmbedBuilder()
            .setTitle(`${emojis[category.directory.toLowerCase()]} ${formatString(category.directory)} Commands`)
            .setColor("Random")
            .setDescription(`Here are the list of commands in the ${category.directory} category.`)
            .addFields(
                category.commands.map((cmd) => {
                    return {
                        name: `\`${cmd.name}\``,
                        value: cmd.description,
                        inline: true
                    };
                })
            )
            .setFooter({ text: "Made with ❤️ by SetItOnZygote"});

            interaction.update({
                embeds: [categoryEmbed]
            });
        });

        collector.on("end", () => {
            initialMessage.edit({
                components: components(true)
            });
        })
    }
}