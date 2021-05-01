import blogService from '../services/blogs'

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
    const newBlog = await blogService.create(blog)
    dispatch({
      type: 'ADD_BLOG',
      data: newBlog
    })
  }
}

export const likeBlog = (blog) => {
  return async dispatch => {
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
  }
}

export const removeBlog = (blog) => {
  return async dispatch => {
    await blogService.remove(blog)
    dispatch({
      type: 'DELETE_BLOG',
      data: blog
    })
  }
}

export default reducer