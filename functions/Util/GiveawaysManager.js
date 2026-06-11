const { GiveawaysManager } = require('discord-giveaways');
const Schema = require("../../database/models/giveaways");

module.exports = (client) => {
    const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {

        // Get all giveaways from the database
        async getAllGiveaways() {
            return await Schema.find().lean().exec();
        }

        // Saves a giveaway in the database
        async saveGiveaway(messageId, giveawayData) {
            await Schema.create(giveawayData);
            return true;
        }

        // Edits a giveaway in the database
        async editGiveaway(messageId, giveawayData) {
            await Schema.updateOne({ messageId }, giveawayData, { omitUndefined: true }).exec();
            return true;
        }

        // Deletes a giveaway from the database
        async deleteGiveaway(messageId) {
            await Schema.deleteOne({ messageId }).exec();
            return true;
        }
    };

    client.giveaways = new GiveawayManagerWithOwnDatabase(client, {
        default: {
            botsCanWin: false,
            embedColor: "#4437db",
            embedColorEnd: "#F00000",
            reaction: "🎉",
        }
    });
};