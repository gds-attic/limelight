Feature: Visiting per-licence
  As a user
  I want to see details about specific licences
  So I can find out how a specific licence is performing
  
  Scenario: licence exists
      Given API responds with application-to-licence-a-street-collection.json
       When I go to /performance/licensing/licences/application-to-licence-a-street-collection
       Then I should get back a status of 200
        And the navigation link for "Licences" should be active
        And the category title should be "Licences"
        And the category title should link to "/performance/licensing/licences"
        And the page title should be "Application to licence a street collection (submissions made through GOV.UK only)"
        And the 1st subtitle should be "Weekly form submissions"
        And the 1st section description should be "Total form submissions per week over the last 9 weeks and top authorities by submission volume in this time"
        And the 2nd subtitle should be "Submissions per authority"
        And the 2nd section description should be "Authorities offering Application to licence a street collection on GOV.UK"
