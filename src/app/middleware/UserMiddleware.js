

class UserMiddleware {
    checkAuthenticated (req, res, next) {
        
        if (req.isAuthenticated()) {
   
            return next();
        }
            
        
        res.redirect('/login');
    }


    isAdmin (req, res,next) {
        if(req.isAuthenticated()) {
            if( req.user.role === '2') {
                    return next();
            } 
            // else {
            //     console.log(2);
            //     // return next();
            // }
        }

        res.redirect('/login');
    }

    isMember (req, res, next) {
        if(req.isAuthenticated()) {
            if( req.user.role !== '2') {
                return next();
            } 
            // else {
            //     console.log(3);
            //     // return next();
            // }
        }
        res.redirect('/login');
    }

    checkNotAuthenticated (req, res, next) {
        if (req.isAuthenticated())
           
            if( req.user.role === '2') {
                
                res.redirect('/admin/index');
            } else {
                // console.log(2);
                res.redirect('/member/home');
                
            }
            // res.redirect('/admin/index');
        return next();
    }
}

module.exports = new UserMiddleware;