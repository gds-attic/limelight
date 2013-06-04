Feature: Overview page
  As a user
  I want to visit the licensing overview page
  So I can see summary data and navigate to other pages

  Scenario: visiting overview page
      Given the flag show_licensing_overview_success_rate is set
        And the flag show_services is set
       When I go to /performance/licensing
       Then I should get back a status of 200
        And the category title should be "Services"
        And the category title should link to "/performance/services"
        And the page title should be "Licensing performance (licences and authorities on GOV.UK only)"
        And the 1st subtitle should be "Form submissions"
        And the 1st section description should be "Total form submissions per week over the last 9 weeks"
        And the 2nd subtitle should be "Completion rate"
        And the 2nd section description should be "Completion rate for all submissions for last week"
        And the 3rd subtitle should be "Submission drop-offs"
        And the 3rd section description should be "Percentages of unique visitors at common stages of licensing submissions \(last week, sampled data\)"
        And the 4th subtitle should be "Top licences last week"
        And the 4th section description should be "Top licences by submission volume last week"
        And the 5th subtitle should be "Top authorities last week"
        And the 5th section description should be "Top authorities by submission volume last week"
        And I see a link to "/performance/licensing/licences"
        And I see a link to "/performance/licensing/authorities"

  Scenario: visiting overview page
      Given the flag show_licensing_overview_success_rate is not set
        And the flag show_services is set
       When I go to /performance/licensing
       Then I should get back a status of 200
        And the category title should be "Services"
        And the category title should link to "/performance/services"
        And the page title should be "Licensing performance (licences and authorities on GOV.UK only)"
        And the 1st subtitle should be "Form submissions"
        And the 1st section description should be "Total form submissions per week over the last 9 weeks"
        And the 2nd subtitle should be "Submission drop-offs"
        And the 2nd section description should be "Percentages of unique visitors at common stages of licensing submissions \(last week, sampled data\)"
        And the 3rd subtitle should be "Top licences last week"
        And the 3rd section description should be "Top licences by submission volume last week"
        And the 4th subtitle should be "Top authorities last week"
        And the 4th section description should be "Top authorities by submission volume last week"
        And I see a link to "/performance/licensing/licences"
        And I see a link to "/performance/licensing/authorities"

  Scenario: navigating to Services page
      Given the flag show_services is set
       When I go to /performance/licensing
       Then the category title should be "Services"
       Then the category title should link to "/performance/services"

  Scenario: navigating to Performance Platform homepage
      Given the flag show_services is not set
       When I go to /performance/licensing
       Then the category title should be "Performance Platform"
       Then the category title should link to "/performance"

