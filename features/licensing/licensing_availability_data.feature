@javascript
Feature: Pingdom data for licensing
  As a service manager
  I want to know the availability of my service
  So that I can better interpret usage data

  @svg
  Scenario: looking up uptime on the licensing overview page
    When I go to /performance/licensing
    Then I should see the module "Service availability"
     And the module should display an uptime of 100%
     And the module should display a response time of 423ms
