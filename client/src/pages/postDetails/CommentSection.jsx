import React, { useState, useRef } from 'react';
import { Typography, TextField, Button, Card, } from '@material-ui/core/';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch } from 'react-redux';

import { commentPost, deleteComment } from '../../redux/actions/posts';
import useStyles from './styles';

const CommentSection = ({post}) => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const [comment, setComment] = useState('');
    const dispatch = useDispatch();
    const [comments, setComments] = useState(post?.comments);
    const classes = useStyles();
    const commentsRef = useRef();
    const handleComment = async () => {
        const newComments = await dispatch(commentPost(`${user?.result?.name}: ${comment}`, post._id));
        setComment('');
        setComments(newComments);

        commentsRef?.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const handleDeleteComment = async (postId,commentId) => {
        const newComments = await dispatch(deleteComment(postId,commentId))
        setComments(newComments)
    }

    return (
        <div>
        <div className={classes.commentsOuterContainer}>
            <div className={classes.commentsInnerContainer}>
            <Typography gutterBottom variant="h6">Comments</Typography>
            {comments.length>0 && comments?.map((el => (
                <Card elevation={2} key={el?._id} className={classes.cardComment}>
                    <Typography  gutterBottom variant="subtitle1">
                    <strong>{el?.comment?.split(':')[0]}:</strong>
                    {el?.comment?.split(':')[1]}
                    </Typography>
                        {user && (user?.result?.googleId === el?.creator || user?.result?._id === el?.creator || user?.result.googleId === post.creator || user.result?._id === post.creator) &&
                        <Button size="small" color="secondary" onClick={() => handleDeleteComment(post._id,el._id)}>
                            <DeleteIcon fontSize="small" /> Delete
                        </Button>}
                </Card>
            )))}
            <div ref={commentsRef} />
            </div>
            {user &&
                user?.result?.name && 
                <div style={{ width: '70%' }}>
                <Typography gutterBottom variant="h6">Write a comment</Typography>
                <TextField fullWidth rows={4} variant="outlined" label="Comment" multiline value={comment} onChange={(e) => setComment(e.target.value)} />
                <br />
                <Button style={{ marginTop: '10px' }} fullWidth disabled={!comment.length} color="primary" variant="contained" onClick={handleComment}>
                    Comment
                </Button>
                </div>
            }
        </div>
        </div>
    );
}

export default CommentSection
