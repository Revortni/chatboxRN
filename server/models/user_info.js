const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Message = new Schema({
    userid: String,
    username:String,
    email:String
});
