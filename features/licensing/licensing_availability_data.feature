@javascript
Feature: Pingdom data for licensing
  As a service manager
  I want to know the availability of my service
  So that I can better interpret usage data

  Scenario: looking up uptime on the licensing overview page
    Given The licensing monitoring bucket returns the response in "licensing_availability_response.json"
     When I go to /performance/licensing
    Then I should see the module "Service availability"
     And the module should display an uptime of 100%
     And the module should display a response time of 423ms

  @wip
  Scenario: visiting the licensing overview page to check licence finder availability
    Given The licence-finder monitoring bucket returns the response in "licence_finder_monitoring.json"
     When I go to /performance/licensing
     Then I should see the module "Licence finder service availability"
      And the module should display an uptime of 100%
      And the module should display a response time of 259ms
