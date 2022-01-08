
const homeRouter = require('./home'); 
const studentRouter = require('./student');
const authRouter = require('./auth.route');
const adminRouter = require('./admin.route');
const memberRouter = require('./member.route');
const postRouter = require('./post.route');

function route(app) {
    
    app.use('/admin', adminRouter);

    // app.use('/login', authRouter);

    app.use('/', memberRouter);


    app.use('/post', postRouter);

    // app.use('/', homeRouter);
    

}

module.exports = route;