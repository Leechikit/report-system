const LogModel = require('./log_model');

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