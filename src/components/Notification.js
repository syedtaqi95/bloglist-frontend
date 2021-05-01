import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  if (notification.message !== null) {
    return (
      <div className={notification.messageType}>
        {notification.message}
      </div>
    )
  }

  return null
}

export default Notification