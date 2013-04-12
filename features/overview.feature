Feature: Overview page
  As a user
  I want to visit the licensing overview page
  So I can see summary data and navigate to other pages

  Scenario: visiting overview page
       When I go to /performance/licensing
       Then I should get back a status of 200
        And the category title should be "Transactions"
        And the page title should be "Licensing (GOV.UK applications)"
        And the 1st subtitle should be "Weekly licence applications"
        And the 1st section description should be "Total licence applications per week over the last 12 weeks"
        And the 2nd subtitle should be "Top licences last week"
        And the 2nd section description should be "Top 5 most applied for licences on GOV.UK last week"
        And the 3rd subtitle should be "Top authorities last week"
        And the 3rd section description should be "Top authorities by licence application volume on GOV.UK last week"
        And I see a link to "/performance/licensing/licences"
        And I see a link to "/performance/licensing/authorities"
