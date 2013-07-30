@javascript
Feature: Electronic Vehicle Licensing dashboard
  As a service manager
  I want to measure my service
  So that I can take data driven decisions

  Scenario: visiting the dashboard
    When I go to /performance/electronic-vehicle-licensing
    Then the page title should be "Electronic Vehicle Licensing"
