let mongoose = require('mongoose');
const server = process.env.SERVER||'127.0.0.1:27017';
const message_database = process.env.DATABASE||'chatbox'; 
let msgModel = require('../models/message');
let instance = null;

//Mongo database
class MsgDatabase{

    constructor(){
        this._messages = {};
        if(!instance){
            instance = this;
        }
        return instance
    }

    connect(){
		return mongoose.connect(`mongodb://${server}/${message_database}`,{useNewUrlParser: true})
            .then(async()=>{
                await this.fetchMessages();
                console.log('Message database connection successful');
                return Promise.resolve(this._messages);                
            })
			.catch(err =>{
                console.error('Database connection error');
                return Promise.reject(err);
            })
	}

    async addMessage(data){
        let message = new msgModel(data);
        try{ 
            await message.save();
            return Promise.resolve();
        } catch(err){
            return Promise.reject(err);
        }
    }

    async fetchMessages(){   
        try{
            this._messages = await msgModel.find();
            return Promise.resolve(this._messages);
        }
        catch(err) {
            console.error(err)
            return Promise.reject(err);
        }  
    }

    static close(){
        mongoose.connection.close();
    }
}

module.exports = new MsgDatabase();