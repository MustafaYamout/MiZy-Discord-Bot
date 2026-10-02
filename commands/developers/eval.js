const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { inspect, format } = require("util");
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
        let code = interaction.options.getString("code");

        const owner = process.env.ownerid || "267299812339220480";
        if (interaction.user.id !== owner) {
            return await interaction.reply({
                content: "You are not the bot owner.",
                flags: MessageFlags.Ephemeral,
            });
        }

        if (code.toLowerCase().includes("token")) {
            return await interaction.reply({
                content: "You cannot get the token of the bot.",
                flags: MessageFlags.Ephemeral,
            });
        }

        code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

        const ZWSP = "\u200B";
        const clean = (text) => typeof text === "string"
            ? text.replace(/@(everyone|here)/g, `@${ZWSP}$1`)
            : text;

        const captured = [];
        const methods = ["log", "info", "warn", "error", "debug"];
        const originals = methods.map((method) => [method, console[method]]);

        for (const method of methods) {
            console[method] = (...args) => {
                captured.push(format(...args));
            };
        }

        const restoreConsole = () => {
            for (const [method, original] of originals) console[method] = original;
        };

        try {
            const start = process.hrtime();
            let evaled;
            try {
                evaled = eval(code);
                if (evaled instanceof Promise) evaled = await evaled;
            } finally {
                restoreConsole();
            }

            const diff = process.hrtime(start);
            const time = diff[0] * 1e3 + diff[1] / 1e6;

            const output = clean(inspect(evaled, { depth: 0 }));
            const logged = clean(captured.join("\n").trim());

            const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Eval")
            .addFields(
                { name: "Input", value: `\`\`\`${code.slice(0, 1000)}\`\`\``, inline: false },
                ...(logged ? [{ name: "Console", value: `\`\`\`${logged.slice(0, 1000)}\`\`\``, inline: false }] : []),
            //    { name: "Output", value: `\`\`\`${output.slice(0, 1000)}\`\`\``, inline: false },
                { name: "Time", value: `${time.toFixed(3)}ms`, inline: false },
            )

            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        } catch (error) {
            const logged = clean(captured.join("\n").trim());

            const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Eval")
            .addFields(
                { name: "Input", value: `\`\`\`${code.slice(0, 1000)}\`\`\``, inline: false },
                ...(logged ? [{ name: "Console", value: `\`\`\`${logged.slice(0, 1000)}\`\`\``, inline: false }] : []),
                { name: "Error", value: `\`\`\`${clean(String(error)).slice(0, 1000)}\`\`\``, inline: false },
            )

            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }
    }
}
