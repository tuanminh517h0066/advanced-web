const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema({
    
    comment: {type: String},
    user: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    post:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        },
    
    
}, {
    timestamps: true,
});

module.exports = mongoose.model('Comment', Comment);