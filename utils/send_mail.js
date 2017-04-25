const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const config = require('../config/host_config');

let transport = nodemailer.createTransport(smtpTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: config.user,
        pass: config.pass
    }
}));

/**
 * 发送邮件
 *
 * @param: {String} receiver 接收邮箱
 * @param: {String} theme 邮箱标题
 * @param: {String} html 邮箱内容
 */
let sendMail = (receiver, theme, html) => {
    return new Promise((resolve,reject)=>{
        transport.sendMail({
            from: config.user,
            to: receiver,
            subject: theme,
            html: html
        }, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log('发送成功');
            }
        });
    });
}

module.exports = sendMail;