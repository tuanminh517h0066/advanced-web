const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Notification = new Schema({
    title: {type: String},
    description: {type: String},
    status: {type: Number},
    department: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
    
}, {
    timestamps: true,
});

module.exports = mongoose.model('Notification', Notification);