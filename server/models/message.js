let mongoose = require('mongoose');
let validator = require('validator');
const Schema = mongoose.Schema;

const msgSchema = new Schema({
    message: String,
    userid: String,
    createdAt: Date
});

msgSchema.statics.getMessages = function(){
    return new Promise((resolve,reject)=>{
        this.find((err,docs)=>{
            if(err){
                console.error(err);
                return reject(err);
            }
            resolve(docs);
        })
    })
}

msgSchema.pre('save',function(next){
    let now = Date.now();
    if(!this.createdAt){
        this.createdAt = now
    }
    next()
})

module.exports = mongoose.model('Message',msgSchema);