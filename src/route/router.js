const express = require('express');
const loginController = require('../controllers/loginController');
const homeController = require('../controllers/homeController');

let router = express.Router();

let userRoute = (app) => {
    router.get('/', loginController.getLogin);
    router.get('/user', loginController.authenToken, loginController.user);
    router.get('/weather', homeController.getWeather);
    router.get('/getHumidity', homeController.getHumidity);
    router.get('/Humidity', homeController.sendHumidity);
    router.get('/controlPump', homeController.controlPump);

    router.post('/addUser', loginController.addUser);
    router.post('/checkLogin', loginController.checkLogin);

    return app.use('/',router);
}

module.exports = userRoute;