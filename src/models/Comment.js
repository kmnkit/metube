import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: mongoose.Types.ObjectID, required: true, ref: 'User' },
    video: { type: mongoose.Types.ObjectID, required: true, ref: 'Video' },
    createdAt: { type: Date, required: true, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;