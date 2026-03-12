Feature: Read Expenses
  As a user of the Personal Finance Tracker
  I want to retrieve my recorded expenses
  So that I can review my spending

  Background:
    Given the expenses database is empty

  # --- List all expenses ---

  Scenario: Listing expenses when none exist
    When I GET "/expenses"
    Then the response status is 200
    And the response body is an empty array

  Scenario: Listing all expenses
    Given the following expenses exist:
      | amount | category      | description        |
      | 42.50  | Food          | Lunch              |
      | 15.00  | Transport     | Bus ticket         |
      | 120.00 | Entertainment | Cinema             |
    When I GET "/expenses"
    Then the response status is 200
    And the response body contains 3 expenses
    And each expense has fields "id", "amount", "category", and "description"

  Scenario: Listing expenses filtered by category
    Given the following expenses exist:
      | amount | category  | description    |
      | 42.50  | Food      | Lunch          |
      | 15.00  | Transport | Bus ticket     |
      | 12.00  | Food      | Coffee         |
    When I GET "/expenses?category=Food"
    Then the response status is 200
    And the response body contains 2 expenses
    And all returned expenses have category "Food"

  Scenario: Filtering by a category that has no expenses
    Given an expense exists with amount 42.50, category "Food" and description "Lunch"
    When I GET "/expenses?category=Transport"
    Then the response status is 200
    And the response body is an empty array

  # --- Get a single expense ---

  Scenario: Getting a single expense by ID
    Given an expense exists with amount 42.50, category "Food" and description "Lunch"
    When I GET "/expenses/{id}"
    Then the response status is 200
    And the response body contains:
      | field       | value      |
      | amount      | 42.50      |
      | category    | Food       |
      | description | Lunch      |
    And the response body includes an "id" field

  Scenario: Getting an expense with a non-existent ID
    When I GET "/expenses/000000000000000000000000"
    Then the response status is 404
    And the response body contains error "expense not found"

  Scenario: Getting an expense with a malformed ID
    When I GET "/expenses/not-a-valid-id"
    Then the response status is 400
    And the response body contains error "invalid expense id"
