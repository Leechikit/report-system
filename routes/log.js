const router = require('koa-router')();
const report = require('../utils/report.js');

router.get('/w', async (ctx, next)=>{
    ctx.body = 'success';
    await report();
});

module.exports = router;