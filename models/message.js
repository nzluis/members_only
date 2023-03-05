const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    title: { type: String, required: true},
    user: { type: Schema.Types.ObjectId, ref: "User", required: true},
    timestamp: { type: Date, default: Date.now },
    text: { type: String, required: true}
})

MessageSchema.virtual("url").get(function(){
    return `/message/${this._id}`
})

MessageSchema.virtual("timestamp_formatted").get(function(){
    return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED)
})