const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "initQueue",
    async execute(queue) {
        queue.autoplay = false
        queue.volume = 50
    }
}