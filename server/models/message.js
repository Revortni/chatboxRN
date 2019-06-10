const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Message = new Schema({
    msgID: ObjectId,
    message: String,
    userid: String,
    dateCreated: { type: Date, default: Date.now }
});