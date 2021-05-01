import React from 'react'

import Notification from './Notification'

import { useDispatch, useSelector } from 'react-redux'
import { setUsername, setPassword } from '../reducers/userReducer'
import { login } from '../reducers/userReducer'

const LoginPage = () => {
  const dispatch = useDispatch()
  const username = useSelector(state => state.user.username)
  const password = useSelector(state => state.user.password)

  // Login event handler
  const handleLogin = (event) => {
    event.preventDefault()
    dispatch(login(username, password))
  }

  return (
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
}

export default LoginPage