let mongoose = require('mongoose');
let validator = require('validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userid: {
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    mail:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate: (val)=>{
            return validator.isEmail(val)
        }
    }
});

userSchema.statics.getUsers = function(){
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

module.exports = mongoose.model('Users',userSchema);