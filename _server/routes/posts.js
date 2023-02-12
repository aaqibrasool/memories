import express from 'express'
import { createPost, getPosts, updatePost, deletePost, likePost, getPostsBySearchAndTags, getPost, commentPost, deleteComment } from '../controllers/posts.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.get('/search',getPostsBySearchAndTags)
router.get('/', getPosts)
router.get('/:id', getPost);
router.post('/',auth, createPost)
router.post('/:id/commentPost',auth,commentPost)
router.patch('/:id',auth, updatePost)
router.delete('/:id',auth, deletePost)
router.delete('/:id/delcomment/:commentId',deleteComment)
router.patch('/:id/likePost',auth, likePost)

export default router