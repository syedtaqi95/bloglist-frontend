import React, { useEffect } from 'react'

import BlogList from './components/BlogList'
import LoginPage from './components/LoginPage'

import { useDispatch, useSelector } from 'react-redux'
import { initBlogs } from './reducers/blogReducer'
import { setLoggedInUser } from './reducers/userReducer'

const App = () => {
  // Redux store
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.loggedInUser)

  // Get blogs on page refresh
  useEffect(() => dispatch(initBlogs()), [])

  // Get loggedinUser from localStorage on page refresh
  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const parsedUser = JSON.parse(loggedInUserJSON)
      dispatch(setLoggedInUser(parsedUser))
    }
  }, [])

  return (
    <div>
      { user === null ? <LoginPage /> : <BlogList />}
    </div>
  )
}

export default App