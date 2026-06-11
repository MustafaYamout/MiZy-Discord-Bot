const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");
const { inspect } = require("util");
require("dotenv").config();

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluate code! (Developer only)")
    .addStringOption(option => option
    .setName("code")
    .setDescription("The code you would like to insert in the bot.")
    .setRequired(true)),
    
    async execute(interaction, client) {
        var code = interaction.options.getString("code");

        if (interaction.user.id != process.env.ownerid || interaction.user.id != "267299812339220480") {
            return await interaction.reply({ content: "You are not the bot owner." });
        } else {
            if (code.includes("token") == true) return await interaction.reply({ content: "You cannot get the token of the bot." });

            code = code.replace(/[""]/g, '"').replace(/['']/g, "'");
            let evaled;

            try {
                const start = process.hrtime();
                evaled = eval(code);
        
                if (evaled instanceof Promise) {
                    evaled = await evaled;
                }
        
                const stop = process.hrtime(start);
                const outputResponse = `\`\`\`${inspect(evaled, { depth: 0 })}\n\`\`\``;

                if (outputResponse.length <= 1024) {
                    const embed = new EmbedBuilder()
                    .setColor("Random")
                    .setTitle("Eval")
                    .setFields(
                        { name: "Input", value: `\`\`\`${code}\`\`\`` , inline: false },
                        { name: "Output", value: outputResponse.substr(0, 1024), inline: false },
                    )
        
                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    })
                }
        

        
    } catch (error) {

        const clean = text => {
            if (typeof (text) === "string")
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }
        
        const embed = new EmbedBuilder()
                    .setColor("Random")
                    .setTitle("Eval")
                    .setFields(
                        { name: "Input", value: `\`\`\`${code}\`\`\`` , inline: false },
                        { name: "Error", value: `\`\`\`${clean(error)}\`\`\``, inline: false },
                    )
        
                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    })
        }
    }
}
}