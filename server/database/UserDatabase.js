let mongoose = require('mongoose');
const server = process.env.SERVER||'127.0.0.1:27017';
const user_database = process.env.DATABASE||'chatbox'; 
let userModel = require('../models/user');
let instance = null
//Mongo database
class UserDatabase{

    constructor(){
        this._users = {};
        if(!instance){
            instance = this;
        }
        return instance
    }

    connect(){
		return mongoose.connect(`mongodb://${server}/${user_database}`,{useNewUrlParser: true})
            .then(async()=>{
                await this.fetchUsers();
                console.log('User database connection successful');
                return Promise.resolve(this._users);                
            })
			.catch(err =>{
                console.error('Database connection error');
                return Promise.reject(err);
            })
	}

    async addUser(data){
        let user = new userModel(data);
        try{ 
            await user.save();
            this._users = await this.fetchUsers();
            return Promise.resolve(this._users);
        } catch(err){
            return Promise.reject(err);
        }
    }

    async fetchUsers(){   
        try{
            this._users = await userModel.find();
            return Promise.resolve(this._users);
        }
        catch(err) {
            console.error(err)
            return Promise.reject(err);
        }  
    }

    renameUser({userid,username}){
        userModel.findOneAndUpdate({userid},{userid,username},function(err,doc){
            if(err){
                console.error(err);
                return;
            }
            doc.save()
            console.log("Renamed Successful");
        });
    }

    static close(){
        mongoose.connection.close();
    }
}

module.exports = new UserDatabase();