
const homeRouter = require('./home'); 
const studentRouter = require('./student');
const authRouter = require('./auth.route');
const adminRouter = require('./admin.route');

function route(app) {
    
    app.use('/admin', adminRouter);

    app.use('/login', authRouter);

    app.use('/student', studentRouter);

    app.use('/', homeRouter);
    

}

module.exports = route;