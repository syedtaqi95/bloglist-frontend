import React from 'react'
import { useHistory } from 'react-router-dom'

import Notification from './Notification'

import { useDispatch, useSelector } from 'react-redux'
import { setUsername, setPassword } from '../reducers/loginReducer'
import { login } from '../reducers/loginReducer'

const LoginPage = () => {
  const dispatch = useDispatch()
  const username = useSelector(state => state.user.username)
  const password = useSelector(state => state.user.password)

  const history = useHistory()

  // Login event handler
  const handleLogin = (event) => {
    event.preventDefault()
    dispatch(login(username, password))
    history.push('/')
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