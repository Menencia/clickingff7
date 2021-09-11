/// <reference types="Cypress" />

describe('Main tests', () => {

  it('should detect title', () => {
    cy.visit('/')
    cy.get('.text-red-500').contains('ClickingFF7')
  })

})
