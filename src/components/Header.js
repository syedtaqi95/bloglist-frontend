import React from 'react'

import Notification from './Notification'

import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../reducers/loginReducer'

const Header = () => {
  const user = useSelector(state => state.user.loggedInUser)
  const dispatch = useDispatch()
  // Logout event handler
  const handleLogout = (event) => {
    event.preventDefault()
    dispatch(logout())
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in
      </p>
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default Header