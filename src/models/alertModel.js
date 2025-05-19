const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    status: String,
    title: String,
    type: String,
    description: String,
    publisher: String,
    time: String
});

const Alert = mongoose.model('Alert', alertSchema);

class AlertModel {
    static async getAll() {
        // Traer todas las alertas desde MongoDB
        return await Alert.find({});
    }
}

module.exports = AlertModel;