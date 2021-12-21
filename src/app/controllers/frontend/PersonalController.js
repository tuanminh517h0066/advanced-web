

class PersonalController {
    
    async Password(req, res, next) {

        res.render('frontend/change-password');
    }

    async infoSetting(req, res, next) {

        res.render('frontend/info-setting');
    }
}

module.exports = new PersonalController;