import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { updateUsers } from '../reducers/userReducer'

const Users = () => {
  const users = useSelector(state => state.users)
  const dispatch = useDispatch()

  // Get users on page render
  useEffect(() => dispatch(updateUsers()), [])

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {[...users]
            .map(user => {
              return (
                <tr key={user.id}>
                  <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
                  <td>{user.blogs.length}</td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}

export default Users