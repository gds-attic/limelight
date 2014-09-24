#@javascript
#Feature: uptime and response time for fco transactions
#  As a service manager
#  I want to know the availability of my service
#  So that I can better interpret usage data
#
#  @svg
#  Scenario: 30 days and 24 hours tabs
#    When I go to /performance/pay-foreign-marriage-certificates
#    Then I should see the module "Service availability"
#     And the module should contain a graph
#     And the module should contain 2 tabs
#
#  @svg
#  Scenario: looking up the last 30 days uptime on an fco dashboard
#    When I go to /performance/pay-foreign-marriage-certificates
#    Then I should see the module "Service availability"
#     And the module should display an uptime of 85%
#     And the module should display a response time of 150ms
#
#  @svg
#  Scenario: switching to 24 hour view
#    Given I go to /performance/pay-foreign-marriage-certificates
#    Then I should see the module "Service availability"
#     And the module should display an uptime of 85%
#    When I select the "24 hours" tab
#     And the module should display an uptime of 84%
#     And the module should display a response time of 188ms
