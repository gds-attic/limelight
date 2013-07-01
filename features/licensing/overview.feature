@javascript
Feature: Overview page
  As a user
  I want to visit the licensing overview page
  So I can see summary data and navigate to other pages

  Scenario: visiting overview page
       When I go to /performance/licensing
       Then I should get back a status of 200

  Scenario: live service module
    Given The licensing realtime bucket returns the response in "licensing_realtime.json"
    When I go to /performance/licensing
    Then I should see the module "Live service usage"
     And the module should contain the text "11 Users online now"

  Scenario: form submissions module
    Given The licensing applications bucket returns the response in "licensing_applications.json"
    When I go to /performance/licensing
    Then I should see the module "Form submissions"
     And the module should contain a graph
     And the module should contain 2 tabs

  Scenario: completion rate module
    When I go to /performance/licensing
    Then I should see the module "Completion rate"

  Scenario: submission drop-offs module
    When I go to /performance/licensing
    Then I should see the module "Submission drop-offs"

  Scenario: top licences module
    When I go to /performance/licensing
    Then I should see the module "Top licences last week"
     And the module should contain a link to "/performance/licensing/licences"

  Scenario: top authorities module
    When I go to /performance/licensing
    Then I should see the module "Top authorities last week"
    And the module should contain a link to "/performance/licensing/authorities"
