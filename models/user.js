const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},
    username: { type: String, required: true},
    password: { type: String, required: true},
    status: {
        type: String,
        required: true,
        enum: ["User", "Member", "Admin"],
        default: "User"
    },
    messages: { type: Schema.Types.ObjectId, ref: "Message", required: true}
})

UserSchema.virtual("url").get(function() {
    return `/users/${this._id}`
})

UserSchema.virtual("full_name").get(function () {
    let fullname = "";
    if (this.first_name && this.last_name) {
      fullname = `${this.first_name} ${this.last_name}`;
    }
    if (!this.first_name || !this.last_name) {
      fullname = "";
    }
    return fullname;
  });

  module.exports = mongoose.model("User", UserSchema)