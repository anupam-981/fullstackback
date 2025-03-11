const mongoose = require('mongoose');

const phonebookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: true }
});

module.exports = mongoose.model('PhonebookEntry', phonebookSchema);
