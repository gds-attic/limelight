@javascript
Feature: uptime and response time for fco transactions
  As a service manager
  I want to know the availability of my service
  So that I can better interpret usage data

  @svg
  Scenario: looking up the uptime on an fco dashboard
    When I go to /performance/pay-foreign-marriage-certificates
    Then I should see the module "Service availability"
     And the module should display an uptime of 85%
     And the module should display a response time of 150ms
