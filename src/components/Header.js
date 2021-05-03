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

  const bg = {
    backgroundColor: '#d3d3d3'
  }

  return (
    <div>
      <div style={bg}>
        <Link to='/' style={padding}>blogs</Link>
        <Link to='/users' style={padding}>users</Link>
        <span style={padding}>{user.name} logged in</span>
        <button onClick={handleLogout}>logout</button>
      </div>
      <h2>Blog app</h2>
      <Notification />
    </div>
  )
}

export default Header