const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    User: String,
    Beg: Number,
    Daily: Number,
    Crime: Number,
    Hourly: Number,
    Weekly: Number,
    Monthly: Number,
    Yearly: Number,
    Work: Number,
    Rob: Number,
    Fish: Number,
    Hunt: Number,
    Present: Number
});

module.exports = mongoose.model("economyCooldown", Schema);
