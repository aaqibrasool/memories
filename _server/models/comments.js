import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    comment:String,
    creator:String,
    id:String,
})

const Comment = mongoose.model('comment',commentSchema)

export default Comment