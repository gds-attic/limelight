Feature: Visiting per-authority
  As a user
  I want to see details about specific authorities
  So I can find out how a specific authority is performing

  Scenario: authority exists
    Given API responds with fake-authority-1.json
    When I go to /performance/licensing/authorities/fake-authority-1
    Then I should get back a status of 200
    And the navigation link for "Authorities" should be active
    And the page title should be "Fake Authority 1"
    And the subtitle should be "Applications handled by Fake Authority 1 on GOV.UK"
