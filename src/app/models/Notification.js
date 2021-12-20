const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Department = new Schema({
    title: {type: String},
    description: {type: String},
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

module.exports = mongoose.model('Department', Department);