import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_BLOGS':
    return action.data

  case 'ADD_BLOG':
    return [...state, action.data]

  case 'LIKE_BLOG': {
    const likedBlog = action.data
    const likedId = likedBlog.id
    return state.map(blog => blog.id === likedId ? likedBlog : blog)
  }

  case 'DELETE_BLOG': {
    const deletedBlog = action.data
    return state.filter(blog => blog.id !== deletedBlog.id)
  }

  default:
    return state
  }
}

export const initBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(blog)
      dispatch({
        type: 'ADD_BLOG',
        data: newBlog
      })
      dispatch(setNotification(
        `added "${blog.title}" by ${blog.author}`,
        'success'
      ))
    } catch (e) {
      dispatch(setNotification(
        `Failed to add "${blog.title}" by ${blog.author}`,
        'error'
      ))
    }
  }
}

export const likeBlog = (blog) => {
  return async dispatch => {
    try {
      const updatedBlog = {
        ...blog,
        user: blog.user.id,
        likes: blog.likes + 1
      }
      const receivedBlog = await blogService.update(updatedBlog)
      dispatch({
        type: 'LIKE_BLOG',
        data: receivedBlog
      })
    } catch (e) {
      dispatch(setNotification(
        `Failed to like "${blog.title}" by ${blog.author}`,
        'error'
      ))
    }
  }
}

export const removeBlog = (blog) => {
  return async dispatch => {
    try {
      await blogService.remove(blog)
      dispatch({
        type: 'DELETE_BLOG',
        data: blog
      })
      dispatch(setNotification(
        `Deleted "${blog.title}" by ${blog.author}`,
        'success'
      ))
    } catch (e) {
      dispatch(setNotification(
        `Failed to delete "${blog.title}" by ${blog.author}`,
        'error'
      ))
    }
  }
}

export default reducer