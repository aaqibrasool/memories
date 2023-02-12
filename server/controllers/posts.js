import mongoose from 'mongoose'
import Comment from '../models/comments.js'
import PostMessage from "../models/postMessage.js"

export const getPosts = async (req, res) => {
    const {page} = req.query
    try {
        const Limit = 8
        const startIdx = (Number(page) - 1) * Limit
        const totalPosts = await PostMessage.countDocuments({})
        const posts = await PostMessage.find().sort({_id : -1}).limit(Limit).skip(startIdx)
        res.status(200).json({posts, currentPage:Number(page), totalPages: Math.ceil(totalPosts / Limit)})
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearchAndTags =async (req,res) => {
    const {searchQuery, tags } = req.query
    try {
        const title = new RegExp(searchQuery, "i");
        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});
        res.json(posts);
    } catch (error) {
        res.status(404).json({message:error.message})
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })

    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}
export const commentPost = async (req,res) => {
    const {id} = req.params
    const {comment} = req.body
    const newComment = new Comment({comment, creator:req.userId})
    const post = await PostMessage.findById(id)
    post.comments.push(newComment)
    const updatedPost = await PostMessage.findByIdAndUpdate(id,post,{new:true})
    res.json(updatedPost)
}
export const updatePost = async (req, res) => {
    const { id } = req.params
    const { title, message, creator, selectedFile, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with this id: ${id}`)

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true })

    res.json(updatedPost)
}

export const deletePost = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with this id: ${id}`)

    await PostMessage.findByIdAndRemove(id)

    res.json({ message: 'Post deleted Successfully' })

}
export const likePost = async (req, res) => {
    const { id } = req.params;
    if(!req.userId) return res.json({message: "unauthorized"})

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessage.findById(id);
    const index = post.likes.findIndex(id => id === String(req.userId))
    
    if(index === -1){
        post.likes.push(req.userId)
    }else{
        post.likes = post.likes.filter(id => id!== String(req.userId))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post , { new: true });
    res.json(updatedPost);
}

export const deleteComment = async (req,res) => {
    const {id,commentId} = req.params
    const post = await PostMessage.findById(id)
    post.comments = post.comments.filter(comment => String(comment._id) !== commentId)
    const postNow = await PostMessage.findByIdAndUpdate(id,post, {new:true})
    res.json(postNow)
}
