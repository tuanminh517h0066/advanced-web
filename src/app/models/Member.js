const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");


const Member = new Schema({
    username: {type: String},
    email: {type: String, required: true},
    password: {type: String},
    department_id: {type: String},
    role: {type: String, required: true},
    departments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department"
        }
    ]
}, {
    timestamps: true,
});

Member.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

Member.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Member', Member);