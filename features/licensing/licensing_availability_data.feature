@javascript
Feature: Pingdom data for licensing
  As a service manager
  I want to know the availability of my service
  So that I can better interpret usage data

  Scenario: looking up uptime on the licensing overview page
    Given The licensing monitoring bucket returns the response in "licensing_availability_response.json"
     When I go to /performance/licensing
     Then the uptime module should display 100%

  Scenario: looking up response time on the licensing overview page
    Given The licensing monitoring bucket returns the response in "licensing_availability_response.json"
     When I go to /performance/licensing
     Then the response time module should display 423ms

  @wip
  Scenario: visiting the licensing overview page to check licence finder availability
    Given The licence-finder monitoring bucket returns the response in "licence_finder_monitoring.json"
     When I go to /performance/licensing
     Then the uptime module for licence finder should display 100%
      And the response time module for licence finder should display 259ms
