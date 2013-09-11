Feature: Listing authorities
  As a user
  I want to see a list of authorities
  So I can navigate to individual authorities

  @javascript
  Scenario: there are two authorities
    Then pry me up
    When I go to /performance/licensing/authorities
    Then I should get back a status of 200
    And the navigation link for "Authorities" should be active
    And there should be 4 authorities
    And the page title should be "Authorities (authorities on GOV.UK only)"
    And the "authorities" count should be 4
    And the 1st group title should be "C"
    And the 2nd group title should be "F"
    And the 1st title in the 1st group should be "City of London"
    And the 1st title in the 2nd group should be "City of Fake authority"
    And the 2nd title in the 2nd group should be "Fake authority 1"
    And the 2nd link in the 2nd group should be "/performance/licensing/authorities/fake-authority-1"
    And the 3rd title in the 2nd group should be "Fake authority 2"
    And the 3rd link in the 2nd group should be "/performance/licensing/authorities/fake-authority-2"

  #wip due to inability to register no license response in multi process (e.g. cross browser) testing
  @no-selenium @svg @wip
  Scenario: there are no authorities
    When I go to /performance/licensing/authorities
    Then I should get back a status of 200
     And the navigation link for "Authorities" should be active
     And there should be 0 authorities
