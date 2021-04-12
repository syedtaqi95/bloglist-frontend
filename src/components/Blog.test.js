import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {

  let component

  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'www.test-url.com',
    likes: 42,
    user: {
      name: 'Test Username',
    },
  }

  beforeEach(() => {
    component = render(
      <Blog blog={blog} />
    )
  })

  test('renders only the title and author by default', () => {
    const div = component.container.querySelector('div')

    expect(div).toHaveTextContent(
      `${blog.title} ${blog.author}`
    )
    expect(div).not.toHaveTextContent(blog.url)
    expect(div).not.toHaveTextContent(`${blog.likes}`)
  })

  test('renders the url and likes, when the \'view\' button is clicked', () => {
    const button = component.container.querySelector('.viewButton')
    fireEvent.click(button)

    const urlDiv = component.container.querySelector('.urlDiv')
    expect(urlDiv).toHaveTextContent(blog.url)

    const likesDiv = component.container.querySelector('.likesDiv')
    expect(likesDiv).toHaveTextContent(`${blog.likes}`)
  })
})