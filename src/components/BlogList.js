import React, { useRef } from 'react'

import Blog from './Blog'
import BlogForm from './BlogForm'
import Notification from './Notification'
import Togglable from './Togglable'

import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { createBlog, likeBlog, removeBlog } from '../reducers/blogReducer'
import { logout } from '../reducers/userReducer'

const BlogList = () => {
  // Redux
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user.loggedInUser)
  const dispatch = useDispatch()

  // Refs
  const blogFormRef = useRef()

  // Logout event handler
  const handleLogout = (event) => {
    event.preventDefault()
    dispatch(logout())
    dispatch(setNotification('logged out', 'success'))
  }

  // Sends a newly created blog to the server
  const addBlog = (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      dispatch(createBlog(blogObject))
      dispatch(setNotification(
        `added "${blogObject.title}" by ${blogObject.author}`,
        'success'
      ))
    } catch (e) {
      dispatch(setNotification(
        `Failed to add "${blogObject.title}" by ${blogObject.author}`,
        'error'
      ))
    }
  }

  // Adds a like and sends a server request
  const incrementLikes = (blog) => {
    try {
      dispatch(likeBlog(blog))
    } catch (e) {
      dispatch(setNotification(
        `Failed to like "${blog.title}" by ${blog.author}`,
        'error'
      ))
    }
  }

  // Asks for confirmation, then sends a delete request to the server
  const deleteBlog = (blogToDelete) => {
    const prompt = `Remove blog '${blogToDelete.title}' by ${blogToDelete.author}?`
    if (window.confirm(prompt)) {
      try {
        dispatch(removeBlog(blogToDelete))
        dispatch(setNotification(
          `Deleted "${blogToDelete.title}" by ${blogToDelete.author}`,
          'success'
        ))
      } catch (e) {
        dispatch(setNotification(
          `Failed to delete "${blogToDelete.title}" by ${blogToDelete.author}`,
          'error'
        ))
      }
    }
  }

  // Sets the display for 'Remove' button only if logged in user is the creator
  const displayRemove = (blogId) => {
    return blogId === user.id ? '' : 'none'
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
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