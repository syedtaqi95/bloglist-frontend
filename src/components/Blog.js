import React, { useState } from 'react'

const Blog = ({ blog, handleLikes, displayRemove, handleRemove }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setShowDetails(!showDetails)
  }

  if (showDetails) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>hide</button>
        </div>
        <div className="urlDiv">
          {blog.url}
        </div>
        <div className = "likesDiv">
          likes {blog.likes}
          <button onClick={() => handleLikes(blog)} className="likeButton">like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <div style={{ display: displayRemove }}>
          <button onClick = {() => handleRemove(blog)} className="removeButton">remove</button>
        </div>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleVisibility} className="viewButton">view</button>
    </div>
  )
}

export default Blog