import React from 'react'

import Notification from './Notification'

import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../reducers/loginReducer'
import { Link, useHistory } from 'react-router-dom'

const Header = () => {
  const user = useSelector(state => state.user.loggedInUser)
  const dispatch = useDispatch()

  const history = useHistory()

  // Logout event handler
  const handleLogout = (event) => {
    event.preventDefault()
    dispatch(logout())
    history.push('/')
  }

  const padding = {
    padding : 5
  }

  const margin = {
    marginBottom : 5
  }

  return (
    <div>
      <div>
        <Link to='/' style={padding}>blogs</Link>
        <Link to='/users' style={padding}>users</Link>
      </div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in
      </p>
      <button onClick={handleLogout} style={margin}>logout</button>
    </div>
  )
}

export default Header