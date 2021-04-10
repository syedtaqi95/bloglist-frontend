import React from 'react'

const Notification = ({ message, className }) => {
  if (message !== null) {
    return (
      <div className={className}>
        {message}
      </div>
    )
  }

  return null
}

export default Notification