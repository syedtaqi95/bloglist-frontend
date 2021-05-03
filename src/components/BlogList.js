import React, { useRef } from 'react'
import { Link } from 'react-router-dom'

import BlogForm from './BlogForm'
import Togglable from './Togglable'

import { useDispatch, useSelector } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'

const BlogList = () => {
  // Redux
  const blogs = useSelector(state => state.blogs)
  const dispatch = useDispatch()

  // Refs
  const blogFormRef = useRef()

  // Sends a newly created blog to the server
  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject))
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Togglable>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes) // sorted by likes in descending order
        .map(blog =>
          <div key={blog.id} style={blogStyle}>
            <Link to={`/blogs/${blog.id}`}>{blog.title} - {blog.author}</Link>
          </div>
        )}
    </div>
  )
}

export default BlogList