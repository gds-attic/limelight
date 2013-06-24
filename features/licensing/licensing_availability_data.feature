@javascript
Feature: Pingdom data for licensing
  As a service manager
  I want to know the availability of my service
  So that I can better interpret usage data

  Scenario: looking up uptime on the licensing overview page
    Given Limelight is running
     When I go to /performance/licensing
     Then the uptime module for licensing should display 100%

  @wip
  Scenario: visiting the licensing overview page to check licensing availability
    Given Limelight is running
     When I go to /performance/licensing
     Then the response time module for licensing should display 377ms

  @wip
  Scenario: visiting the licensing overview page to check licence finder availability
    Given Limelight is running
     When I go to /performance/licensing
     Then the uptime module for licence finder should display 100%
      And the response time module for licence finder should display 259ms
