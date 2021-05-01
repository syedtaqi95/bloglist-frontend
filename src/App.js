import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'

const App = () => {
  // State hooks
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  // Refs
  const blogFormRef = useRef()

  // Get blogs on page refresh
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  // Get loggedinUser from localStorage on page refresh
  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Login event handler
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)

    } catch (e) {
      dispatch(setNotification('wrong username or password', 'error'))
    }
  }

  // Logout event handler
  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
    setUsername('')
    setPassword('')
    blogService.setToken(null)
    dispatch(setNotification('logged out', 'success'))
  }

  // Sends a newly created blog to the server
  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const savedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(savedBlog))

      dispatch(setNotification(
        `added "${savedBlog.title}" by ${savedBlog.author}`,
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
  const incrementLikes = async (blog) => {
    const updatedBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1
    }

    try {
      const savedBlog = await blogService.update(updatedBlog)
      setBlogs(blogs.map(blog => blog.id === savedBlog.id ? savedBlog : blog))

    } catch (e) {
      dispatch(setNotification(
        `Failed to like "${blog.title}" by ${blog.author}`,
        'error'
      ))
    }
  }

  const deleteBlog = async (blogToDelete) => {
    const prompt = `Remove blog '${blogToDelete.title}' by ${blogToDelete.author}?`
    if (window.confirm(prompt)) {
      try {
        await blogService.remove(blogToDelete)
        setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
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
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            id="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
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