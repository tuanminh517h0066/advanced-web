const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Department = new Schema({
    name: {type: String},
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
    
    
}, {
    timestamps: true,
});

module.exports = mongoose.model('Department', Department);