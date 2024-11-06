const express = require('express');
const loginController = require('../controllers/loginController');

let router = express.Router();

let userRoute = (app) => {
    router.get('/', loginController.getLogin);
    router.get('/user', loginController.authenToken, loginController.user);

    router.post('/addUser', loginController.addUser);
    router.post('/checkLogin', loginController.checkLogin);

    return app.use('/',router);
}

module.exports = userRoute;