const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Like = new Schema({
    
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

module.exports = mongoose.model('Like', Like);