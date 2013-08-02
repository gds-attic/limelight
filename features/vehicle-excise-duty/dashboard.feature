@javascript
Feature: Vehicle excise duty dashboard
  As a service manager
  I want to measure my service
  So that I can take data driven decisions

  Scenario: visiting the dashboard
    When I go to /performance/vehicle-excise-duty
    Then the page title should be "Vehicle excise duty"

  Scenario: looking up the tax disc availability module
    Given The tax-disc monitoring bucket returns the response in "availability.json"
    When I go to /performance/vehicle-excise-duty
    Then I should see the module "Tax disc service availability"
     And the module should display an uptime of 85.0%
     And the module should display a response time of 150ms

  Scenario: looking up the sorn availability module
    Given The register-sorn-statutory-off-road-notification monitoring bucket returns the response in "availability.json"
    When I go to /performance/vehicle-excise-duty
    Then I should see the module "SORN service availability"
     And the module should display an uptime of 85.0%
     And the module should display a response time of 150ms
