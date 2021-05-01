import React, { useEffect } from 'react'
import { Switch, Route } from 'react-router'

import BlogList from './components/BlogList'
import LoginPage from './components/LoginPage'

import { useDispatch, useSelector } from 'react-redux'
import { initBlogs } from './reducers/blogReducer'
import { setLoggedInUser } from './reducers/loginReducer'
import Users from './components/Users'
import { initUsers } from './reducers/userReducer'

const App = () => {
  // Redux store
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.loggedInUser)

  // Get blogs on page render
  useEffect(() => dispatch(initBlogs()), [])

  // Get users on page render
  useEffect(() => dispatch(initUsers()), [])

  // Get loggedinUser from localStorage on page render
  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const parsedUser = JSON.parse(loggedInUserJSON)
      dispatch(setLoggedInUser(parsedUser))
    }
  }, [])

  return (
    <div>
      { user === null ?
        <Route>
          <LoginPage />
        </Route> :
        <Switch>
          <Route path='/users'>
            <Users />
          </Route>
          <Route path='/'>
            <BlogList />
          </Route>
        </Switch>
      }
    </div>
  )
}

export default App