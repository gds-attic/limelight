Feature: Listing authorities
  As a user
  I want to see a list of authorities
  So I can navigate to individual authorities

  Scenario: there are two authorities
    Given API responds with two_authorities.json
    When I go to /performance/licensing/authorities
    Then I should get back a status of 200
    And the navigation link for "Authorities" should be active
    And there should be 2 authorities
    And the 1st title should be "fake-authority-1"
    And the 1st link should be "/performance/licensing/authorities/fake-authority-1"
    And the 2nd title should be "fake-authority-2"
    And the 2nd link should be "/performance/licensing/authorities/fake-authority-2"


  Scenario: there are no authorities
    Given API responds with no_authorities.json
    When I go to /performance/licensing/authorities
    Then I should get back a status of 200
     And the navigation link for "Authorities" should be active
     And there should be 0 authorities
