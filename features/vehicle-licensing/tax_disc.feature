@javascript
Feature: Tax disc dashboard
  As a service manager
  I want to measure my service
  So that I can take data driven decisions

  Scenario: looking at the tax disc application volume graph
    Given The vehicle-excise-duty channels bucket returns the response in "vehicle_excise_duty_services.json"
    When I go to /performance/tax-disc
    Then I should see the module "Applications"
    And the module should contain a graph

  Scenario: looking at the tax disc error codes module
    Given The vehicle-licensing failures bucket returns the response in "vehicle_licensing_failures.json"
    When I go to /performance/tax-disc
    Then I should see the module "Error codes (web)"
     And the module should contain a table

  Scenario: looking up the tax disc availability module
    Given The tax-disc monitoring bucket returns the response in "availability.json"
    When I go to /performance/tax-disc
    Then I should see the module "Service availability"
     And the module should display an uptime of 85.0%
     And the module should display a response time of 150ms

  Scenario Outline: Navigating to related pages
    Given The vehicle-licensing channels bucket returns the response in "vehicle_licensing_channels.json"
    When I go to /performance/tax-disc
     And I click on "<Title>"
    Then I should get back a status of 200
     And I should be at <Path>
     And the page title should be "<Title>"
    
    Examples:
      | Title             | Path                           |
      | SORN              | /performance/sorn              |
      | Vehicle licensing | /performance/vehicle-licensing |

  Scenario: looking for live users
    Given The tax-disc realtime bucket returns the response in "licensing_realtime.json"
    When I go to /performance/tax-disc
    Then I should see the module "Users on start page"
    And the tax-disc realtime module should display a user count of 11
