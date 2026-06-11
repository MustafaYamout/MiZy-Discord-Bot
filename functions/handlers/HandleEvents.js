const fs = require("fs");

module.exports = (client) => {
    client.HandleEvents = async() => {
        const eventsFolder = fs.readdirSync(`./events`);

        for (const folder of eventsFolder) {
            const eventFiles = fs.readdirSync(`./events/${folder}`)
            .filter((file) => file.endsWith(".js"));
            
            switch(folder) {
                case "client":
                    for (const file of eventFiles) {
                        const event = require(`../../events/${folder}/${file}`);

                        if (event.once) {
                            client.once(event.name, (...args) => event.execute(...args, client));
                        } else {
                            client.on(event.name, (...args) => event.execute(...args, client));
                        }
                    }
                    break;
                
                case "distube":
                    for (const file of eventFiles) {
                        const event = require(`../../events/${folder}/${file}`);

                        client.distube.on(event.name, (...args) => event.execute(...args, client));
                    }

                case "giveaways":
                    for (const file of eventFiles) {
                        const event = require(`../../events/${folder}/${file}`);

                        client.giveaways.on(event.name, (...args) => event.execute(...args, client));
                    }
                
                default:
                    break;
            }
        }
    }
}