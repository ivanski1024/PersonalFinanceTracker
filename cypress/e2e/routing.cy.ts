describe('Navigation', () => {
  it('shows expense list on home page', () => {
    cy.visit('http://localhost:5173/')
    cy.get('nav').contains('Expenses')
    cy.get('nav').contains('Add Expense')
  })

  it('shows add expense form on /add', () => {
    cy.visit('http://localhost:5173/add')
    cy.contains('button', 'Add Expense')
  })
})
