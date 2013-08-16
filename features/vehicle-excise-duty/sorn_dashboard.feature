@javascript
Feature: SORN dashboard
  As a service manager
  I want to measure my service
  So that I can take data driven decisions

   Scenario: looking at the SORN failures module
     Given The vehicle-licensing failures bucket returns the response in "vehicle_licensing_failures.json"
     When I go to /performance/sorn
     Then I should see the module "SORN application failures"
      And the module should contain a table

  Scenario: looking up the sorn availability module
    Given The register-sorn-statutory-off-road-notification monitoring bucket returns the response in "availability.json"
    When I go to /performance/sorn
    Then I should see the module "SORN service availability"
     And the module should display an uptime of 85.0%
     And the module should display a response time of 150ms
