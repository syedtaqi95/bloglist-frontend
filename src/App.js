import React, { useEffect, useRef } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import { useDispatch, useSelector } from 'react-redux'
import { clearNotification, setNotification } from './reducers/notificationReducer'
import { initBlogs, createBlog, likeBlog, removeBlog } from './reducers/blogReducer'
import { setUsername, setPassword, setLoggedInUser, login, logout } from './reducers/userReducer'

const App = () => {
  // Redux store
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const username = useSelector(state => state.user.username)
  const password = useSelector(state => state.user.password)
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

  // Login event handler
  const handleLogin = (event) => {
    event.preventDefault()
    try {
      dispatch(login(username, password))
      dispatch(clearNotification())
    } catch (e) {
      console.log(e)
      dispatch(setNotification('wrong username or password', 'error'))
    }
  }

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

  // Login form
  const loginPage = () => (
    <div>
      <h2>Log in to application</h2>

      <Notification />

      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            id="username"
            value={username}
            name="Username"
            onChange={({ target }) => dispatch(setUsername(target.value))}
          />
        </div>
        <div>
          password
          <input
            type="password"
            id="password"
            value={password}
            name="Password"
            onChange={({ target }) => dispatch(setPassword(target.value))}
            autoComplete="current-password"
          />
        </div>
        <button type="submit" id="login-button">login</button>
      </form>
    </div>
  )

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
      { user === null ? loginPage() : blogList()}
    </div>
  )
}

export default App