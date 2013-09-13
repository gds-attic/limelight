@javascript
Feature: SORN dashboard
  As a service manager
  I want to measure my service
  So that I can take data driven decisions

  @svg
  Scenario: looking at the SORN application volume graph
     When I go to /performance/sorn
     Then I should see the module "Applications"
      And the module should contain a graph

   Scenario: looking at the SORN error codes module
     When I go to /performance/sorn
     Then I should see the module "Error codes (web)"
      And the module should contain a table

  @svg
  Scenario: looking up the sorn availability module
    When I go to /performance/sorn
    Then I should see the module "Service availability"
     And the module should display an uptime of 85%
     And the module should display a response time of 150ms

  Scenario: customer satisfaction module
     When I go to /performance/sorn
     Then I should see the module "Customer satisfaction"
      And the module should contain the text "92.5% August 2013"
      And the module should contain the text "0% July 2013"

  Scenario: looking for live users
     When I go to /performance/sorn
     Then I should see the module "Users on start page"
      And the sorn realtime module should display a user count of 11

  @svg
  Scenario: looking at the SORN digital take-up module
     When I go to /performance/sorn
     Then I should see the module "Digital take-up"
      And the module should contain a graph
      And the module should contain the text "52.0% last 12 months"

  Scenario Outline: Navigating to related pages
    When I go to /performance/sorn
     And I click on "<Title>"
    Then I should get back a status of 200
     And I should be at <Path>
     And the page title should be "<Title>"
    
    Examples:
      | Title              | Path                           |
      | Tax disc           | /performance/tax-disc          |
      | Vehicle licensing  | /performance/vehicle-licensing |
