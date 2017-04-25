const LogModel = require('./log_model');

/**
 * 保存日志
 *
 * @param: {Object} obj 信息
 */
function saveLog(obj){
	let log = new LogModel(obj);
	log.save((error, doc) => {
	    if (error) {
	        console.log(error);
	    }
	});
}

module.exports = saveLog;