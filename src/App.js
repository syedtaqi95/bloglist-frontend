import React, { useEffect, useRef } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginPage from './components/LoginPage'

import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initBlogs, createBlog, likeBlog, removeBlog } from './reducers/blogReducer'
import { setLoggedInUser, logout } from './reducers/userReducer'

const App = () => {
  // Redux store
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user.loggedInUser)

  // Refs
  const blogFormRef = useRef()

  // Get blogs on page refresh
  useEffect(() => dispatch(initBlogs()), [])

  // Get loggedinUser from localStorage on page refresh
  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      dispatch(setLoggedInUser(user))
    }
  }, [])

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

  // Main page
  const blogList = () => (
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

  return (
    <div>
      { user === null ? <LoginPage /> : blogList()}
    </div>
  )
}

export default App