const express = require('express');
const loginController = require('../controllers/loginController');
const homeController = require('../controllers/homeController');

let router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Trang đăng nhập
 *     responses:
 *       200:
 *         description: Trả về giao diện đăng nhập.
 */
router.get('/', loginController.getLogin);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Lấy thông tin người dùng
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID người dùng
 *                 username:
 *                   type: string
 *                   description: Tên người dùng
 *       401:
 *         description: Không được phép
 */
router.get('/user', loginController.authenToken, loginController.user);

/**
 * @swagger
 * /weather:
 *   get:
 *     summary: Lấy thông tin thời tiết
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 temperature:
 *                   type: number
 *                   description: Nhiệt độ (°C)
 *                 humidity:
 *                   type: number
 *                   description: Độ ẩm (%)
 */
router.get('/weather', homeController.getWeather);

/**
 * @swagger
 * /getHumidity:
 *   get:
 *     summary: Lấy độ ẩm đất từ cảm biến
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 humidity:
 *                   type: number
 *                   description: Giá trị độ ẩm hiện tại
 */
router.get('/getHumidity', homeController.getHumidity);

/**
 * @swagger
 * /Humidity:
 *   get:
 *     summary: Gửi độ ẩm đến client
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 humidity:
 *                   type: number
 *                   description: Giá trị độ ẩm
 */
router.get('/Humidity', homeController.sendHumidity);

/**
 * @swagger
 * /controlPump:
 *   get:
 *     summary: Bật/tắt máy bơm
 *     parameters:
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         required: true
 *         description: Trạng thái máy bơm ("on" hoặc "off")
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Trạng thái máy bơm
 */
router.get('/controlPump', homeController.controlPump);

/**
 * @swagger
 * /history:
 *   get:
 *     summary: Lấy lịch sử trạng thái máy bơm
 *     responses:
 *       200:
 *         description: Thành công, trả về danh sách lịch sử máy bơm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       state:
 *                         type: string
 *                         description: Trạng thái máy bơm ("on" hoặc "off")
 *                       time:
 *                         type: string
 *                         description: Thời gian thay đổi trạng thái
 *       404:
 *         description: Không có lịch sử
 *       500:
 *         description: Lỗi khi truy xuất lịch sử
 */
router.get('/history', homeController.getHistory); // Thêm route cho getHistory

/**
 * @swagger
 * /addUser:
 *   post:
 *     summary: Thêm người dùng mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Tên người dùng
 *               password:
 *                 type: string
 *                 description: Mật khẩu người dùng
 *     responses:
 *       201:
 *         description: Người dùng được thêm thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/addUser', loginController.addUser);

/**
 * @swagger
 * /checkLogin:
 *   post:
 *     summary: Kiểm tra thông tin đăng nhập
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Tên người dùng
 *               password:
 *                 type: string
 *                 description: Mật khẩu người dùng
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Đăng nhập thất bại
 */
router.post('/checkLogin', loginController.checkLogin);

let userRoute = (app) => {
    return app.use('/', router);
};

module.exports = userRoute;
