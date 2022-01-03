const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Department = new Schema({
    name: {type: String},
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notification",
        }
    ],
    facility_status: { type: Number }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Department', Department);