Feature: Visiting per-authority
  As a user
  I want to see details about specific authorities
  So I can find out how a specific authority is performing

  Scenario: authority exists
    Given API responds with fake-authority-1.json
    When I go to /performance/licensing/authorities/fake-authority-1
    Then I should get back a status of 200
    And the navigation link for "Authorities" should be active
    And the category title should be "Authorities"
    And the category title should link to "/performance/licensing/authorities"
    And the page title should be "Fake authority 1"
    And the 1st subtitle should be "Weekly form submissions"
    And the 1st section description should be "Total form submissions per week over the last 9 weeks and top licences by submission volume in this time"
    And the 2nd subtitle should be "Licence submissions"
    And the 2nd section description should be "Licences offered by Fake authority 1 on GOV.UK"
