import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  test('renders only the title and author by default', () => {
    const blog = {
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'www.test-url.com',
      likes: 42,
    }

    const component = render(
      <Blog blog={blog} />
    )

    const div = component.container.querySelector('div')

    expect(div).toHaveTextContent(
      `${blog.title} ${blog.author}`
    )
    expect(div).not.toHaveTextContent(blog.url)
    expect(div).not.toHaveTextContent(`${blog.likes}`)
  })
})