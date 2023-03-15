const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { DateTime } = require("luxon");

const MessageSchema = new Schema({
    title: { type: String, required: true},
    user: { type: Schema.Types.ObjectId, ref: "User", required: true},
    timestamp: { type: Date, default: Date.now, required: true},
    text: { type: String, required: true}
})

MessageSchema.virtual("url").get(function(){
    return `/message/${this._id}`
})

MessageSchema.virtual("timestamp_formatted").get(function(){
    return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_MED)
})

module.exports = mongoose.model("Message", MessageSchema)