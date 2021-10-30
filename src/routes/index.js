
const homeRouter = require('./home'); 
const studentRouter = require('./student');

function route(app) {
    
    
    app.use('/student', studentRouter);

    app.use('/', homeRouter);
    

}

module.exports = route;