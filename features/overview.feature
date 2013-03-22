Feature: Overview page
  As a user
  I want to visit the licensing overview page
  So I can see summary data and navigate to other pages

  Scenario: visiting overview page
       When I go to /performance/licensing
       Then I should get back a status of 200
        And the navigation link for "Overview" should be active
        And the page title should be "Licensing"
        And the subtitle should be "Licence applications on GOV.UK"
