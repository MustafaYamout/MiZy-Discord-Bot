const { SlashCommandBuilder } = require("@discordjs/builders");
const figlet = require("figlet");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("ascii")
    .setDescription("Turn your text into ASCII art!")
    .addStringOption(option => option.setName("text")
    .setDescription("The text you want to put on the achievement.")
    .setRequired(true)),
    async execute(interaction, client) {
        figlet(interaction.options.getString("text"), function(err, data) {
            if (err) {
                interaction.reply({
                    content: "Something went wrong... Please try again later."
                })
                console.dir(err);
                return;
            }

            interaction.reply({
                content: "```" + data + "```"
            })
        })
    }
}