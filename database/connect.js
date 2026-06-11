const mongoose = require("mongoose");

async function connect() {
    mongoose.set('strictQuery', false);
    try {
        console.log(`Database >> MongoDB is connecting...`)
        await mongoose.connect(process.env.mongotoken, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.log(`[ERROR] >> MongoDB >> Failed to connect to MongoDB! >> Error: ${err}`)
        console.log("Exiting...")
        process.exit(1)
    }


    mongoose.connection.once("open", () => {
        console.log(`Database >> MongoDB is ready!`)
    });

    mongoose.connection.on("error", (err) => {
        console.log(`[ERROR] >> MongoDB >> Failed to connect to MongoDB! >> Error: ${err}`)
        console.log("Exiting...")
        process.exit(1)
    });
    return;
}

module.exports = connect