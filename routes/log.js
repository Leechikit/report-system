const router = require('koa-router')();
const logFormat = require('../utils/log_format');
const saveLog = require('../utils/save_log');
const realtimeReport = require('../utils/realtime_report');

router.get('/w', async (ctx, next)=>{
    ctx.body = 'success';
    // 格式化获取的数据
    let logObj = logFormat(ctx);
    // 保存到数据库
    await saveLog(logObj);
    // 实时报警
    await realtimeReport(logObj.reportType, logObj.time);
});

module.exports = router;