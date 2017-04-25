const router = require('koa-router')();
const logFormat = require('../utils/log_format');
const saveLog = require('../utils/save_log');

router.get('/w', async (ctx, next)=>{
    ctx.body = 'success';
    let logObj = logFormat(ctx);
    await saveLog(logObj);
});

module.exports = router;