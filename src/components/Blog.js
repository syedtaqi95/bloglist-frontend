import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { likeBlog, removeBlog } from '../reducers/blogReducer'

const Blog = () => {
  const blogs = useSelector(state => state.blogs)
  const loggedInUser = useSelector(state => state.user.loggedInUser)
  const dispatch = useDispatch()

  const history = useHistory()

  // Find blog if in individual blog view
  const match = useRouteMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  if (!blog) {
    return null
  }

  // Adds a like and sends a server request
  const handleLike = (blog) => {
    dispatch(likeBlog(blog))
  }

  // Asks for confirmation, then sends a delete request to the server
  const handleRemove = (blogToDelete) => {
    const prompt = `Remove blog '${blogToDelete.title}' by ${blogToDelete.author}?`
    if (window.confirm(prompt)) {
      dispatch(removeBlog(blogToDelete))
      history.push('/') // Redirect to home page
    }
  }

  // Sets the display for 'Remove' button only if logged in user is the creator
  const displayRemoveButton = () => {
    return blog.user.id === loggedInUser.id ? '' : 'none'
  }

  return (
    <div className="blogDetailedView">
      <h2>{blog.title} - {blog.author}</h2>
      <div className="urlDiv">
        {blog.url}
      </div>
      <div className="likesDiv">
        likes {blog.likes}
        <button onClick={() => handleLike(blog)} className="likeButton">like</button>
      </div>
      <div>
        added by {blog.user.name}
      </div>
      <div style={{ display: displayRemoveButton(blog) }}>
        <button onClick={() => handleRemove(blog)} className="removeButton">remove</button>
      </div>
    </div>
  )
}

export default Blog