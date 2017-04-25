/**
 * 格式化上报日志
 *
 * @param: {Objet} ctx 请求对象
 * @return: {Object} 格式化后的对象
 */
var logFormat = function (ctx) {
    var logObj = new Object();
    // 请求信息
    var req = ctx.request;
    // 添加请求日志
    var method = req.method;
    // 页面地址
    logObj["url"] = req.header["referer"];
    // 上报时间
    let date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);
    logObj["time"] = date.getTime();
    // 请求参数
    if (method === 'GET') {
        let query = req.query;
        for(let key in query){
            logObj[key] = query[key];
        };
    } else {
        logObj["request body"] = req.body;
    }
    return logObj;
}

module.exports = logFormat;