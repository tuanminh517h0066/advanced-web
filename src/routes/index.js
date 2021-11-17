
const homeRouter = require('./home'); 
const studentRouter = require('./student');
const authRouter = require('./auth.route');

function route(app) {
    
    app.use('/login', authRouter);

    app.use('/student', studentRouter);

    app.use('/', homeRouter);
    

}

module.exports = route;