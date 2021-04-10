import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import AddBlog from './components/AddBlog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  // State hooks
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

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
      setMessage(`logged in as ${user.name}`)
      setMessageType('success')
      setTimeout(() => setMessage(null), 5000)

    } catch (e) {
      setMessage('wrong username or password')
      setMessageType('error')
      setTimeout(() => setMessage(null), 5000)
    }
  }

  // Logout event handler
  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
    setUsername('')
    setPassword('')
    setTitle('')
    setAuthor('')
    setUrl('')
    blogService.setToken(null)
    setMessage('logged out')
    setMessageType('success')
    setTimeout(() => setMessage(null), 5000)
  }

  // Submit new blog event handler
  const handleAddBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = {
        title: title,
        author: author,
        url: url,
      }

      const savedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(savedBlog))

      setTitle('')
      setAuthor('')
      setUrl('')
      setMessage(`added "${savedBlog.title}" by ${savedBlog.author}`)
      setMessageType('success')
      setTimeout(() => setMessage(null), 5000)

    } catch (e) {
      setMessage(`Failed to add "${title}" by ${author}`)
      setMessageType('error')
      setTimeout(() => setMessage(null), 5000)
    }
  }

  // Login form
  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>

      <Notification message={message} className={messageType} />

      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            autoComplete="current-password"
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  // Blogs list
  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={message} className={messageType} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <AddBlog
        title={title}
        setTitle={setTitle}
        author={author}
        setAuthor={setAuthor}
        url={url}
        setUrl={setUrl}
        handleAddBlog={handleAddBlog}
      />

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>
      {user === null ?
        loginForm() :
        blogList()
      }
    </div>
  )
}

export default App