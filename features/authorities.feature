Feature: Listing authorities
  As a user
  I want to see a list of authorities
  So I can navigate to individual authorities

  Scenario: there are two authorities
    Given API responds with authorities.json
    When I go to /performance/licensing/authorities
    Then I should get back a status of 200
    And the navigation link for "Authorities" should be active
    And there should be 4 authorities
    And the category title should be "Licensing"
    And the category title should link to "/performance/licensing"
    And the page title should be "Authorities (authorities on GOV.UK only)"
    And the 1st title should be "City of London"
    And the 2nd title should be "City of Fake authority"
    And the 3rd title should be "Fake authority 1"
    And the 3rd link should be "/performance/licensing/authorities/fake-authority-1"
    And the 4th title should be "Fake authority 2"
    And the 4th link should be "/performance/licensing/authorities/fake-authority-2"


  Scenario: there are no authorities
    Given API responds with no_authorities.json
    When I go to /performance/licensing/authorities
    Then I should get back a status of 200
     And the navigation link for "Authorities" should be active
     And there should be 0 authorities
