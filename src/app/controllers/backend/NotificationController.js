
const Department = require('../../models/Department');
const Notification = require('../../models/Notification');

const { mutipleMongooseToObject } = require('../../../util/mongoose');
const { mongooseToObject } = require('../../../util/mongoose');

class NotificationController {

    async notificationList(req, res, next) {

        const notificationList = await Notification.find({}).populate('department').sort('-createdAt');
        const admin_name = req.user;

        res.render('backend/notification/list', {
            notifications: mutipleMongooseToObject(notificationList),
            admin: mongooseToObject(admin_name),
            layout: 'backend'
        });
    }

    async deleteNotification(req, res, next) {
        var notification_id = req.body.notification_id;
        
        Notification.findOneAndDelete({_id: notification_id }, async function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                const department = await Department.findById(docs.department);
                department.notifications.pull(notification_id)
                await department.save();
            }
        });
        res.redirect('back');
    }
}

module.exports = new NotificationController;