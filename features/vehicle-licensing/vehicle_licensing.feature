@javascript
Feature: Vehicle licensing dashboard
  As a service manager
  I want to measure my service
  So that I can take data driven decisions

  Scenario: visiting the dashboard
    When I go to /performance/vehicle-licensing
    Then the page title should be "Vehicle licensing"

  Scenario: looking at the application types graph
    Given The vehicle-licensing channels bucket returns the response in "vehicle_licensing_services.json"
    When I go to /performance/vehicle-licensing
    Then I should see the module "Applications by service"
     And the module should contain a graph

  Scenario: looking at the application channels graph
    Given The vehicle-licensing channels bucket returns the response in "vehicle_licensing_channels.json"
    When I go to /performance/vehicle-licensing
    Then I should see the module "Applications by channel"
     And the module should contain a graph

  Scenario Outline: Navigating to related pages
    Given The vehicle-licensing channels bucket returns the response in "vehicle_licensing_channels.json"
    When I go to /performance/vehicle-licensing
     And I click on "<Title>"
    Then I should get back a status of 200
     And I should be at <Path>
     And the page title should be "<Title>"
    
    Examples:
      | Title       | Path                      |
      | Tax disc    | /performance/tax-disc     |
      | SORN        | /performance/sorn         |
