/**
 * @name: realtime_report
 * @description: 实时上报
 * @author: lizijie
 * @update: 
 */
const reportConfig = require('../config/report_config');
const sendMail = require('./send_mail');
const findLog = require('./find_log');
// 日期缓存
let dateCache = {};

/**
 * 保存日志的日期到缓存中
 *
 * @param: {Object} logs 日志对象
 */
function saveDate(logs){
    logs.forEach((log)=>{
        dateCache[log._doc.reportType].unshift(log._doc.time);
    });
}

/**
 * 初始化日期缓存
 *
 * @param: {String} reportType 项目id
 * @param: {Number} reportLimit 报警阀值
 */
async function initDate(reportType, reportLimit){
    let logs = await findLog({'reportType':reportType},{'time':-1},reportLimit);
    // 日志数量大于0则存储到缓存中
    await logs.length > 0 && saveDate(logs);
}

/**
 * 轮询所有项目
 *
 */
function loopReportConfig() {
    for( let reportType in reportConfig){
        let {
            watch,
            reportLimit
        } = reportConfig[reportType];
        // 若开启监听，则缓存日期
        if(watch == true){
            dateCache[reportType] = [];
            initDate(reportType,reportLimit);
        }
    }
}

/**
 * 添加日期到缓存
 *
 * @param: {String} reportType 项目id
 * @param: {Number} time 日期
 */
function addDate(reportType, time){
	// 添加日期到缓存中
    dateCache[reportType].push(time);
    // 若缓存中的日期数量大于配置的阀值，则删除最早的日期。
    if(dateCache[reportType].length > reportConfig[reportType].reportLimit){
        dateCache[reportType].shift();
    }
}

/**
 * 获取设置的检查时间内日志数量
 *
 * @param: {String} reportType 项目id
 * @return: {Number} 日志数量
 */
function countLog(reportType){
    let checktime = reportConfig[reportType]['checktime'];
    let dateList = dateCache[reportType];
    // 缓存中项目的最后一个日期
    let lastDate = dateList[dateList.length - 1];
    // 获取从最后一个日期往前，到设置的检查时间内的缓存日期。
    let filterDate = dateList.filter((date)=>{
        return +date >= +lastDate - +checktime;
    });
    return filterDate.length;
}

/**
 * 实时上报
 *
 * @param: {String} reportType 项目id
 * @param: {Number} time 日期
 */
function realtimeReport(reportType, time){
	// 添加日期到缓存
    addDate(reportType,time);
    // 获取设置的检查时间内日志数量
    let count = countLog(reportType);
    let theme = reportConfig[reportType]['name'] + '报警通知';
    let html = `<p>${reportConfig[reportType]['name']}报障数超过${reportConfig[reportType]['reportLimit']}条</p>`;
    // 若检查时间内日志数量大于设置的阀值，则发邮局报警报警
    if(count >= reportConfig[reportType]['reportLimit']){
        let mails = reportConfig[reportType]['mails'];
        mails.forEach((item) => {
            sendMail(item, theme, html);
        });
    }
}


// 执行轮询
loopReportConfig();

module.exports = realtimeReport;