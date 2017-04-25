const LogModel = require('./log_model');

/**
 * 查询数据库
 *
 * @param: {Object} query 查询条件
 * @param: {Object} sort 排序条件
 * @param: {Number} limit 显示数据数
 */
function findLog(query, sort, limit) {
    return new Promise((resolve,reject)=>{ 
        LogModel.find(query, {'_id':0}, (err,res)=>{
            if(err){
                console.log(err);
            }else{
                resolve(res);
            }
        }).sort(sort).limit(limit);
    });
}
module.exports = findLog;