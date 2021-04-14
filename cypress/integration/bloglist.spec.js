Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedInUser', JSON.stringify(body))
    cy.visit('http://localhost:3001')
  })
})

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'root',
      password: 'secret',
      name: 'Superuser'
    })
    cy.visit('http://localhost:3001')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('root')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()

      cy.contains('Superuser logged in')
    })

    it('fails with incorrect credentials', function () {
      cy.get('#username').type('root')
      cy.get('#password').type('incorrect')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html')
        .should('not.contain', 'Superuser logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'root', password: 'secret' })
    })

    it('a new blog can be created', function () {
      cy.contains('create new blog').click()
      cy.get('#title').type('Blog Title')
      cy.get('#author').type('Blog author')
      cy.get('#url').type('www.blog-url.com/this-is-a-blog')

      cy.get('#create-button').click()

      cy.contains('Blog Title Blog author')
    })
  })

})