const mongoose = require('mongoose');

async function connect() {

    try {
        // await mongoose.connect('mongodb://127.0.0.1:27017/final_project');
        await mongoose.connect('mongodb+srv://admin:admin123@cluster0.wvmvl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

        console.log("connect successfully!!!");
    } catch (error) {
        console.log("connect failure");
    }

}

module.exports = { connect };