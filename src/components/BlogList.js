import React, { useRef } from 'react'

import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import Header from './Header'

import { useDispatch, useSelector } from 'react-redux'
import { createBlog, likeBlog, removeBlog } from '../reducers/blogReducer'

const BlogList = () => {
  // Redux
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user.loggedInUser)
  const dispatch = useDispatch()

  // Refs
  const blogFormRef = useRef()

  // Sends a newly created blog to the server
  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject))
  }

  // Adds a like and sends a server request
  const incrementLikes = (blog) => {
    dispatch(likeBlog(blog))
  }

  // Asks for confirmation, then sends a delete request to the server
  const deleteBlog = (blogToDelete) => {
    const prompt = `Remove blog '${blogToDelete.title}' by ${blogToDelete.author}?`
    if (window.confirm(prompt)) {
      dispatch(removeBlog(blogToDelete))
    }
  }

  // Sets the display for 'Remove' button only if logged in user is the creator
  const displayRemove = (blogId) => {
    return blogId === user.id ? '' : 'none'
  }

  return (
    <div>
      <Header />
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Togglable>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            handleLikes={incrementLikes}
            displayRemove={displayRemove(blog.user ? blog.user.id : '')}
            handleRemove={deleteBlog}
          />
        )}
    </div>
  )
}

export default BlogList