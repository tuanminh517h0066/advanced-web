const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Student = new Schema({
    name: {type: String},
    mssv: {type: String},
    
}, {
    timestamps: true,
});

module.exports = mongoose.model('Student', Student);