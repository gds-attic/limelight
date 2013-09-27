@javascript
Feature: Tax disc dashboard
  As a service manager
  I want to measure my service
  So that I can take data driven decisions

  @svg
  Scenario: looking at the tax disc application volume graph
    When I go to /performance/tax-disc
    Then I should see the module "Applications"
    And the module should contain a graph

  Scenario: looking at the tax disc error codes module
    When I go to /performance/tax-disc
    Then I should see the module "Error codes (web)"
     And the module should contain a table

  @svg
  Scenario: looking up the tax disc availability module
    When I go to /performance/tax-disc
    Then I should see the module "Service availability"
     And the module should display an uptime of 85%
     And the module should display a response time of 12.6s

  Scenario: customer satisfaction module
     When I go to /performance/tax-disc
     Then I should see the module "Customer satisfaction"
      And the module should contain the text "93.8% August 2013"
      And the module should contain the text "-1.34% July 2013"

  Scenario: looking for live users
     When I go to /performance/tax-disc
     Then I should see the module "Users on start page"
      And the tax-disc realtime module should display a user count of 11

  @svg
  Scenario: looking at the tax disc digital take-up module
     When I go to /performance/tax-disc
     Then I should see the module "Digital take-up"
      And the module should contain a graph
      And the module should contain the text "52.0% last 12 months"

  Scenario Outline: Navigating to related pages
    When I go to /performance/tax-disc
     And I click on "<Title>"
    Then I should get back a status of 200
     And I should be at <Path>
     And the page title should be "<Title>"
    
    Examples:
      | Title             | Path                           |
      | SORN              | /performance/sorn              |
      | Vehicle licensing | /performance/vehicle-licensing |

