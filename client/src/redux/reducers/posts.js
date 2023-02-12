import { FETCH_ALL, CREATE, UPDATE, DELETE, LIKE, FETCH_BY_SEARCH, START_LOADING, END_LOADING,FETCH_POST, COMMENT,DELETE_COMMENT } from '../constants/actionTypes';

const initState = {
    loading:false,
    posts:[],
    error:false,
}

const postsReducer = (state=initState, action) => {
    switch (action.type) {
        case START_LOADING:
            return {...state, loading:true}
        case END_LOADING:
            return {...state, loading:false}
        
        case FETCH_ALL:
            return {...state, posts:action.payload.posts, currentPage: action.payload.currentPage, totalPages:action.payload.totalPages};
        case FETCH_POST:
            return { ...state, post: action.payload.post };
        case FETCH_BY_SEARCH:
            return {...state, posts:action.payload}
        case LIKE:
        case UPDATE:
        case COMMENT:
        case DELETE_COMMENT:
            return {...state, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post))}
        case CREATE:
            return {...state, posts: [...state.posts, action.payload]};
        case DELETE:
            return {...state, posts: state.posts.filter((post) => post._id !== action.payload)}
        default:
            return state;
    }
};

export default postsReducer