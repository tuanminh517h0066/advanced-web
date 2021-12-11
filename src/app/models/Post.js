const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Post = new Schema({
    title: {type: String},
    content: {type: String},
    status: {type: Number},
    image: {type: String},
    video: {type: String},
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    department: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Like"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]

    
}, {
    timestamps: true,
});

module.exports = mongoose.model('Post', Post);