const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    User: String,
    Beg: Number,
    Daily: Number,
    Crime: String,
    Hourly: String,
    Weekly: String,
    Monthly: String,
    Yearly: String,
    Work: String,
    Rob: String,
    Fish: String,
    Hunt: String,
    Present: String
});

module.exports = mongoose.model("economyCooldown", Schema);