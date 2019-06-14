let userdb = require('./database/UserDatabase');
let msgdb = require('./database/MsgDatabase');
// async function run(){
//     try{
//         let data = await userdb.connect();
//         return Promise.resolve(data);
//     } catch(err){
//         return Promise.reject(err);
//     }
// }

// run().then((x)=>console.log(x));

async function run(){
    try{
        let data = await msgdb.connect();
        data = await msgdb.addMessage({userid:"45745c60-7b1a-11e8-9c9c-2d42b21b1a3e",message:"hello you"})
        return Promise.resolve(data);
    } catch(err){
        return Promise.reject(err);
    }
}

run().then((x)=>console.log(x));