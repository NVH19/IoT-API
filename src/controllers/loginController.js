const db = require('../models/index')
const functionLogin = require('../services/loginService');
const { where } = require('sequelize');
const jwt = require('jsonwebtoken');

let getLogin = (req,res) => {
    res.send('Hello app');
}
let addUser = async (req, res) => {
    const { username, password, email } = req.body;
    // console.log(req.body);
    try {
        if (username === "" || password === "" || email === "") {
            return res.status(400).json({ status: 400, title: 'Warning', message: 'Vui lòng điền đầy đủ thông tin!' });
        }
        let isEmailExist = await functionLogin.checkEmailExist(email);
        let istrueEmail = await functionLogin.isValidEmail(email);
        let isusernameExist = await functionLogin.checkUsernameExist(username);

        if (password.length < 8) {
            return res.status(400).json({ status: 400, title: 'Warning', message: 'Mật khẩu phải có ít nhất 8 kí tự!' });
        }
        if (isEmailExist) {
            return res.status(400).json({ status: 400, title: 'Warning', message: 'Email đã được sử dụng!' });
        }
        if (isusernameExist) {
            return res.status(400).json({ status: 400, title: 'Warning', message: 'Tài khoản người dùng đã tồn tại!' });
        }
        if (!istrueEmail){
            return res.status(400).json({ status: 400, title: 'Warning', message: 'Email không hợp lệ' });
        }
        

        let newPass = await functionLogin.hashPassword(password);
        const newUser = await db.Users.create({username, password: newPass ,email});
        return res.status(200).json({ status: 200, title: 'Success', message: 'Đăng ký thành công!', data: newUser });
    } catch (error) {
        console.log('Lỗi khi tạo tài khoản!', error);
        return res.status(500).json({ status: 500, title: 'Error', message: 'Đã có lỗi xảy ra khi tạo tài khoản!' });
    }
};
let checkLogin = async (req, res) => {
    const { username, password } = req.body;
    const user = { username: username, password: password };
    try {
        if (username === "" || password === "") {
            return res.status(400).json({ status: 400, title: 'Warning', message: 'Vui lòng điền đầy đủ thông tin!' });
        }
        let isUserExist = await functionLogin.checkUser(username, password);
        if (!isUserExist) {
            return res.status(400).json({ status: 400, title: 'Warning', message: 'Tên đăng nhập hoặc mật khẩu không chính xác!' });
        }
        const accessToken = await functionLogin.genAccsesToken(user);
        const refreshToken = await functionLogin.genRefreshToken(user);
        return res.status(200).json({ status: 200, title: 'Success', message: 'Đăng nhập thành công!', user, accessToken, refreshToken });
    } catch (error) {
        console.log('Lỗi khi đăng nhập!', error);
        return res.status(500).json({ status: 500, title: 'Error', message: 'Đã có lỗi xảy ra khi đăng nhập!' });
    }
};

// Middleware để xác thực access token
let authenToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']; // Dạng Bearer Token
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Không có token!' });
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: `Token không hợp lệ! ${err}` });
        req.user = user;
        // console.log(err,user);
        next();
    })

};
let user = async (req, res) => {
    return res.json(req.user);
}

let changPassword = async (req,res) =>{
    const {oldPass, newPass} = req.body;
    try{
        if(oldPass == "" || newPass == ""){
            return res.status(400).json({ status: 400, title: 'Warning', message: 'Vui lòng điền đầy đủ thông tin!' });
        }
        
    }catch(e){

    }
}

module.exports = {
    getLogin,
    addUser, checkLogin, user, authenToken
};