const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/index');
const { where } = require('sequelize');
var salt = bcrypt.genSaltSync(10);

const hashPassword = async (password) => {
    var hashPass = bcrypt.hashSync(password, salt);
    return hashPass;
}

const checkUser = async (username, passwordUser) => {
    let user = await db.Users.findOne({
        where: { username: username }
    })
    // console.log(user);
    if (!user) return false;
    if (!bcrypt.compareSync(passwordUser, user.password)) return false;
    return true;
}

const checkEmailExist = async (email) => {
    let email_ok = await db.Users.findOne({
        where: { email: email }
    })
    if (!email_ok) return false;
}

const checkUsernameExist = async (username) => {
    let username_ok = await db.Users.findOne({
        where: { username: username }
    })
    if (!username_ok) return false;
}

const isValidEmail = async (email) => {
    // Biểu thức chính quy kiểm tra email có dạng ...@gmail.com hoặc ...@ptit.edu.ptit.vn
    const emailRegex = /^[^\s@]+@(gmail\.com|ptit\.edu\.ptit\.vn)$/;
    return emailRegex.test(email);
}

const getUserName = async (email) => {
    let user = await db.Users.findOne({
        where: { email: email }
    })
    if (!user) return '';
    return user.username;
}
const genAccsesToken = async (user) => {
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
    return accessToken;
}
const genRefreshToken = async (user) => {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '19d' });
    return refreshToken;
}

module.exports = {
    getUserName,
    hashPassword, checkUser, isValidEmail, checkEmailExist, checkUsernameExist,
    genAccsesToken, genRefreshToken
}