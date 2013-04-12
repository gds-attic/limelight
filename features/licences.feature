Feature: Listing licences
  As a user
  I want to see a list of licences
  So I can navigate to individual licences

  Scenario: there are two licences
      Given API responds with two_licences.json
       When I go to /performance/licensing/licences
       Then I should get back a status of 200
        And the navigation link for "Licences" should be active
        And there should be 2 licences
        And the category title should be "Licensing"
        And the category title should link to "/performance/licensing"
        And the page title should be "Licences"
        And the 1st title should be "Application to licence a street collection"
        And the 1st link should be "/performance/licensing/licences/application-to-licence-a-street-collection"
        And the 2nd title should be "Register as a scrap metal dealer"
        And the 2nd link should be "/performance/licensing/licences/register-as-a-scrap-metal-dealer"
  
  Scenario: there are no licences
      Given API responds with no_licences.json
       When I go to /performance/licensing/licences
       Then I should get back a status of 200
        And the navigation link for "Licences" should be active
        And there should be 0 licences
