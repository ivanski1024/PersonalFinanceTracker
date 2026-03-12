Feature: Add Expense
  As a user of the Personal Finance Tracker
  I want to record an expense
  So that I can track my spending

  Background:
    Given the expenses database is empty

  Scenario: Successfully adding a valid expense
    When I POST to "/expenses" with:
      | field       | value      |
      | amount      | 42.50      |
      | category    | "Food"     |
      | description | "Lunch"    |
    Then the response status is 201
    And the response body contains:
      | field       | value      |
      | amount      | 42.50      |
      | category    | "Food"     |
      | description | "Lunch"    |
    And the response body includes an "id" field
    And the expense is persisted in the database

  Scenario: Amount is missing
    When I POST to "/expenses" with:
      | field       | value      |
      | category    | "Food"     |
      | description | "Lunch"    |
    Then the response status is 400
    And the response body contains error "amount is required"

  Scenario: Amount is zero
    When I POST to "/expenses" with:
      | field       | value      |
      | amount      | 0          |
      | category    | "Food"     |
      | description | "Lunch"    |
    Then the response status is 400
    And the response body contains error "amount must be greater than zero"

  Scenario: Amount is negative
    When I POST to "/expenses" with:
      | field       | value      |
      | amount      | -10.00     |
      | category    | "Food"     |
      | description | "Lunch"    |
    Then the response status is 400
    And the response body contains error "amount must be greater than zero"

  Scenario: Category is missing
    When I POST to "/expenses" with:
      | field       | value      |
      | amount      | 42.50      |
      | description | "Lunch"    |
    Then the response status is 400
    And the response body contains error "category is required"

  Scenario: Description is missing
    When I POST to "/expenses" with:
      | field       | value      |
      | amount      | 42.50      |
      | category    | "Food"     |
    Then the response status is 400
    And the response body contains error "description is required"

  Scenario: Retrieving all expenses after adding one
    Given an expense exists with amount 42.50, category "Food" and description "Lunch"
    When I GET "/expenses"
    Then the response status is 200
    And the response body contains 1 expense
