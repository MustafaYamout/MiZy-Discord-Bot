const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    User: String,
    Money: Number,
    Bank: Number
});

module.exports = mongoose.model("economy", Schema);