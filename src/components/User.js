import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'

import { useSelector } from 'react-redux'

const User = () => {
  const users = useSelector(state => state.users)

  // find user info if in individual user view
  const match = useRouteMatch('/users/:id')
  const user = match
    ? users.find(u => u.id === match.params.id)
    : null

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default User