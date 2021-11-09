
class HomeController {

    index(req, res) {
        res.render('backend/login')
    }
}

module.exports = new HomeController;