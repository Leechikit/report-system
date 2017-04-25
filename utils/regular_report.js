/**
 * @name: regular_report
 * @description: 定期上报
 * @author: lizijie
 * @update: 
 */

const sendMail = require('./send_mail');
const reportConfig = require('../config/report_config');
const hostConfig = require('../config/host_config');
const mailFormat = require('./mail_format');
const LogModel = require('./log_model');
const findLog = require('../utils/find_log');
// 轮询间隔
const DURATION = 60000;

/**
 * 获取当前时间
 *
 * @param: {Date} date 日期
 * @return: {Object} 时间
 */
function getNowDate(date) {
    let nowDate = date == void 0 ? new Date() : new Date(date);
    nowDate.setSeconds(0);
    nowDate.setMilliseconds(0);
    return {
    	year: nowDate.getFullYear(),
    	month: nowDate.getMonth() + 1,
    	day: nowDate.getDate(),
        hour: nowDate.getHours(),
        minute: nowDate.getMinutes(),
        nowDate: nowDate
    }
}

/**
 * 获取上一天日期
 *
 * @param: {Date} date 日期
 * @return: {Object} 时间
 */
function getLastDate(date) {
	let lastDate = date == void 0 ? new Date() : new Date(date);
	lastDate.setDate(lastDate.getDate() - 1);
    lastDate.setSeconds(0);
    lastDate.setMilliseconds(0);
    return {
        lastDate: lastDate
    }
}

/**
 * 获取配置时间
 *
 * @return: {Object} 时间
 */
function getConfigDate() {
    var timeArr = hostConfig.sendTime.split(':');
    return {
        configHour: timeArr[0],
        configMinute: timeArr[1]
    }
}

/**
 * 拼接邮件标题
 *
 * @param: {Number} reportType 上报项目id
 * @param: {Date} minDate 最小日期
 * @param: {Date} maxDate 最大日期
 */
function getTheme(reportType, minDate, maxDate) {
	let nowDateStr = maxDate.year+'年'+maxDate.month+'月'+maxDate.day;
    let lastDateStr = minDate.year+'年'+minDate.month+'月'+minDate.day;
    let theme = reportConfig[reportType].name+' '+lastDateStr+'至'+nowDateStr+'报警情况';
    return theme;
}

/**
 * 上报信息发送邮件
 *
 * @param: {Number} reportType 上报项目id
 * @param: {Date} minDate 最小日期
 * @param: {Date} maxDate 最大日期
 */
 async function reportLogMes(reportType,minDate,maxDate) {
    let mes = await findLog({ 'reportType': reportType, 'time': { '$gt': minDate.getTime(), '$lte': maxDate.getTime() } });    
    let theme = getTheme(reportType,minDate,maxDate);
    let {mails} = reportConfig[reportType];
    console.log(mes);
    console.log(theme);
    console.log(mails);
    // 数据库中有数据则发送
    mes && mails.forEach((item) => {
        sendMail(item,theme,mailFormat(mes));
    });
}

/**
 * 循环所有项目
 *
 */
function loopReportConfig(dateMin, dateMax) {
    for (let reportType in reportConfig) {
        let {
            watch,
            mails
        } = reportConfig[reportType];
        // 若开启监听并有设置邮箱则发送邮件
        if (watch == true && mails && mails.length > 0) {
            reportLogMes(reportType,dateMin,dateMax);
        }
    }
}

/**
 * 定时轮询
 *
 */
function loopDate() {
	//获取设置小时和分钟
    let {configHour, configMinute} = getConfigDate();
    let interval = setInterval(() => {
    	// 获取当前小时,分钟和日期
        let {hour, minute, nowDate} = getNowDate();
        // 当设置时分与当前时分一样，则循环项目发送邮件
        if (configHour == hour && configMinute == minute) {
            // 获取上一天日期
            let {lastDate} = getLastDate()
            // 循环所有项目
            loopReportConfig(lastDate, nowDate);
        }
    }, DURATION);
}

module.exports = loopDate;
