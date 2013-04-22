Feature: Overview page
  As a user
  I want to visit the licensing overview page
  So I can see summary data and navigate to other pages

  Scenario: visiting overview page
       When I go to /performance/licensing
       Then I should get back a status of 200
        And the category title should be "Performance Platform"
        And the category title should link to "/performance"
        And the page title should be "Licensing performance (licences and authorities on GOV.UK only)"
        And the 1st subtitle should be "Weekly form submissions"
        And the 1st section description should be "Total form submissions per week over the last 9 weeks"
        And the 2nd subtitle should be "Top licences last week"
        And the 2nd section description should be "Top licences by submission volume last week"
        And the 3rd subtitle should be "Top authorities last week"
        And the 3rd section description should be "Top authorities by submission volume last week"
        And I see a link to "/performance/licensing/licences"
        And I see a link to "/performance/licensing/authorities"
