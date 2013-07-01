@javascript
Feature: uptime and response time for fco transactions
  As a service manager
  I want to know the availability of my service
  So that I can better interpret usage data

  Scenario: looking up the uptime on an fco dashboard
    Given The pay-foreign-marriage-certificates monitoring bucket returns the response in "pay_foreign_marriage_availability.json"
    When I go to /performance/pay-foreign-marriage-certificates
    Then the uptime module for the fco transaction should display 85%

  Scenario: looking up the response time on an fco dashboard
    Given The pay-foreign-marriage-certificates monitoring bucket returns the response in "pay_foreign_marriage_availability.json"
    When I go to /performance/pay-foreign-marriage-certificates
    Then the response time module for the fco transaction should display 150ms
