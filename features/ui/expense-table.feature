Feature: Expense Table
  As a user
  I want to view and manage all my expenses in a single table
  So that I have a clear overview and can add or remove entries without leaving the page

  Background:
    Given the following expenses exist:
      | name      | amount | category  |
      | Coffee    | 5      | Going out |
      | Groceries | 30     | Shopping  |
      | Salary    | 1000   | Job       |

  # --- Table structure ---

  Scenario: Table displays correct column headers
    When I view the finance tracker
    Then I should see a table with columns "Name", "Amount", "Category"

  Scenario: Each row shows the correct expense data
    When I view the finance tracker
    Then the table should contain 3 rows
    And I should see a row with name "Coffee", amount "5", and category "Going out"
    And I should see a row with name "Groceries", amount "30", and category "Shopping"
    And I should see a row with name "Salary", amount "1000", and category "Job"

  Scenario: Total row shows sum of all amounts
    When I view the finance tracker
    Then I should see a "Total" row with amount "1035"

  # --- Remove ---

  Scenario: Removing an expense
    When I view the finance tracker
    And I click the "Remove" button on the "Coffee" row
    Then the "Coffee" row should no longer appear in the table
    And the table should contain 2 rows
    And the "Total" row should show amount "1030"

  Scenario: Removing the last expense
    Given only one expense exists with name "Coffee", amount "5", and category "Going out"
    When I view the finance tracker
    And I click the "Remove" button on the "Coffee" row
    Then the table should show "No expenses found."

  # --- Inline add row ---

  Scenario: Add row is always visible at the bottom of the table
    When I view the finance tracker
    Then I should see an input row with placeholders "Enter name...", "Enter amount...", "Enter category..."
    And I should see an "Add" button next to the input row

  Scenario: Adding a new expense via the inline form
    When I view the finance tracker
    And I enter "Lunch" in the name field
    And I enter "12" in the amount field
    And I enter "Food" in the category field
    And I click the "Add" button
    Then a new row with name "Lunch", amount "12", and category "Food" should appear in the table
    And the input fields should be cleared
    And the "Total" row should show amount "1047"

  Scenario: Adding an expense with missing fields shows validation
    When I view the finance tracker
    And I click the "Add" button without filling in any fields
    Then no new row should be added to the table
    And I should see a validation message

  # --- Filtering ---

  Scenario: Filtering by category
    When I view the finance tracker
    And I filter by category "Shopping"
    Then the table should contain 1 row
    And I should see a row with name "Groceries"
